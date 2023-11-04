import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import GuestGameRoom, RankingGameRoom, ComputerGameRoom, Game, Move
from .utils import get_cookie

ranking_queue = []
guest_queue = []

class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.room_group_name = 'queue'
            self.user = self.scope['user']

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()

            if self.user.is_authenticated:
                ranking_queue.append(self)

                await self.check_ranking_queue()
            else:
                guest_queue.append(self)

                await self.check_guest_queue()
        except Exception:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        if self in ranking_queue:
            ranking_queue.remove(self)
        elif self in guest_queue:
            guest_queue.remove(self)

    async def check_ranking_queue(self):
        if len(ranking_queue) >= 2:
            user_one = ranking_queue.pop()
            user_two = ranking_queue.pop()

            if user_one.user != user_two.user:
                room = await database_sync_to_async(RankingGameRoom.objects.create)(
                    white_player=user_one.scope['user'],
                    black_player=user_two.scope['user']
                )

                await user_one.send(json.dumps({'url': str(room.id)}))
                await user_two.send(json.dumps({'url': str(room.id)}))
            else:
                ranking_queue.append(user_one)

    async def check_guest_queue(self):
        if len(guest_queue) >= 2:
            user_one = guest_queue.pop()
            user_two = guest_queue.pop()

            room = await database_sync_to_async(GuestGameRoom.objects.create)()

            await user_one.send(json.dumps({'url': str(room.id), 'guest_game_token': room.white_player}))
            await user_two.send(json.dumps({'url': str(room.id), 'guest_game_token': room.black_player}))


class GameConsumer(AsyncWebsocketConsumer):
    """
    Parent Consumer class for all Game Consumers.
    Provides all needed methods for game compliance.
    """

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action_type = text_data_json.get('type')

        if action_type == 'move':
            await self.receive_move(text_data_json)
        elif action_type == 'promotion':
            await self.receive_promotion(text_data_json)
        elif action_type == 'castle':
            await self.receive_castle(text_data_json)
        else:
            await self.send_error()

    async def send_error(self):
        await self.send(json.dumps({
            'error': 'Message you sent was invalid.'
        }))

    async def receive_castle(self, data):
        _, oldPos, newPos = data.values()
        game = await self.get_game()

        if await self.perform_move_validation(game, oldPos, newPos, castle=True):
            move = await self.perform_move_creation(game, oldPos, newPos, castle=True)

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_castle',
                'turn': game.turn,
                'castling': game.castling,
                'oldPos': oldPos,
                'newPos': newPos,
                'move': move
            })
        else:
            await self.send_error()

    async def receive_promotion(self, data):
        _, promotion_type, oldPos, newPos = data.values()
        game = await self.get_game()

        if len(promotion_type) == 1 and await self.perform_move_validation(game, oldPos, newPos, promotion=promotion_type):
            move = await self.perform_move_creation(game, oldPos, newPos, promotion=promotion_type)

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_promotion',
                'turn': game.turn,
                'promotionType': promotion_type,
                'oldPos': oldPos,
                'newPos': newPos,
                'move': move
            })
        else:
            await self.send_error()

    async def receive_move(self, data):
        _, oldPos, newPos = data.values()
        game = await self.get_game()

        if await self.perform_move_validation(game, oldPos, newPos):
            move = await self.perform_move_creation(game, oldPos, newPos)

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_move',
                'turn': game.turn,
                'castling': game.castling,
                'oldPos': oldPos,
                'newPos': newPos,
                'move': move
            })
        else:
            await self.send_error()

    async def send_promotion(self, event):
        _, turn, promotion_type, oldPos, newPos, move = event.values()

        await self.send(json.dumps({
            'type': 'promotion',
            'turn': turn,
            'promotionType': promotion_type,
            'oldPos': oldPos,
            'newPos': newPos,
            'move': move
        }))

    async def send_move(self, event):
        _, turn, castling, oldPos, newPos, move = event.values()

        await self.send(json.dumps({
            'type': 'move',
            'turn': turn,
            'castling': castling,
            'oldPos': oldPos,
            'newPos': newPos,
            'move': move
        }))

    async def send_castle(self, event):
        _, turn, castling, oldPos, newPos, move = event.values()

        await self.send(json.dumps({
            'type': 'castle',
            'turn': turn,
            'castling': castling,
            'oldPos': oldPos,
            'newPos': newPos,
            'move': move
        }))

    async def perform_move_creation(self, game, oldPos, newPos, promotion='', castle=False):
        """
        Add move to the Database and update current game state.
        Returns move in form of classic chess notation.
        """

        oldRow, oldCol = oldPos
        newRow, newCol = newPos

        piece = game.positions[oldRow][oldCol]
        newPosPiece = game.positions[newRow][newCol]

        colLetters = 'abcdefgh'
        rowLetters = '87654321'

        if castle:
            game.castling = '--' + game.castling[2:4] if piece[0] == 'w' else game.castling[0:2] + '--'
            game.positions[newRow][newCol] = piece
            game.positions[oldRow][oldCol] = ''

            if newCol - oldCol == 2:
                move = 'O-O'

                game.positions[newRow][newCol - 1] = piece[0] + 'r'
                game.positions[newRow][7] = ''
            else:
                move = 'O-O-O'

                game.positions[newRow][newCol + 1] = piece[0] + 'r'
                game.positions[newRow][0] = ''
        else:
            if piece[1] == 'r':
                if oldCol == 0:
                    game.castling = game.castling.replace('Q' if piece[0] == 'w' else 'q', '-')
                if oldCol == 7:
                    game.castling = game.castling.replace('K' if piece[0] == 'w' else 'k', '-')
            elif piece[1] == 'k':
                game.castling = '--' + game.castling[2:4] if piece[0] == 'w' else game.castling[0:2] + '--'

            move = piece[1].upper() if piece[1] != 'p' else ''

            if newPosPiece:
                if not move:
                    move += colLetters[oldCol]
                move += 'x'

            move += f'{colLetters[newCol]}{rowLetters[newRow]}'

            if promotion:
                move += f'={promotion.upper()}'

            game.positions[newRow][newCol] = piece[0] + promotion if promotion else piece
            game.positions[oldRow][oldCol] = ''

        await database_sync_to_async(Move.objects.create)(game=game, turn=game.turn, positions=game.positions, move=move)

        game.turn = 'w' if game.turn == 'b' else 'b'

        await game.asave()

        return move

    async def perform_move_validation(self, game, oldPos, newPos, promotion='', castle=False):
        """
        Perform every validation needed for received move.
        Returns True if all validations pass.
        """

        oldRow, oldCol = oldPos
        newRow, newCol = newPos

        piece = game.positions[oldRow][oldCol]
        newPosPiece = game.positions[newRow][newCol]

        if await self.get_player_color() != piece[0]:
            return False
        elif piece[0] != game.turn:
            return False
        elif newPosPiece and piece[0] == newPosPiece[0]:
            return False
        elif newRow < 0 or newRow > 7 or newCol < 0 or newCol > 7:
            return False
        elif promotion and promotion != 'q' and promotion != 'r' and promotion != 'b' and promotion != 'n':
            return False
        elif piece[1] == 'p':
            if not promotion and ((piece[0] == 'w' and newRow == 0) or (piece[0] == 'b' and newRow == 7)):
                return False
            elif promotion and ((piece[0] == 'w' and newRow != 0) or (piece[0] == 'b' and newRow != 7)):
                return False

        match piece[1]:
            case 'p':
                return await self.validate_pawn(piece, game.positions, oldPos, newPos)
            case 'n':
                return await self.validate_knight(oldPos, newPos)
            case 'r':
                return await self.validate_rook(game.positions, oldPos, newPos)
            case 'b':
                return await self.validate_bishop(game.positions, oldPos, newPos)
            case 'q':
                return await self.validate_queen(game.positions, oldPos, newPos)
            case 'k':
                return await self.validate_king(game.castling, piece, castle, oldPos, newPos)
            case _:
                return await self.send_error()

    async def validate_pawn(self, piece, positions, oldPos, newPos):
        oldRow, oldCol = oldPos
        newRow, newCol = newPos

        direction = 1 if piece[0] == 'w' else -1
        starting_pos = 6 if piece[0] == 'w' else 1

        # Check for one tile move
        if oldRow - newRow == direction and oldCol == newCol and not positions[newRow][newCol]:
            return True
        # Check for two tiles move from starting position
        elif oldRow == starting_pos and oldRow - newRow == direction * 2 and oldCol == newCol and not positions[newRow][newCol]:
            return True
        # Check for diagonal capture
        elif oldRow - newRow == direction and abs(oldCol - newCol) == 1 and positions[newRow][newCol]:
            return True

        return False

    async def validate_knight(self, oldPos, newPos):
        oldRow, oldCol = oldPos
        newRow, newCol = newPos

        row_diff = abs(newRow - oldRow)
        col_diff = abs(newCol - oldCol)

        if (row_diff == 2 and col_diff == 1) or (row_diff == 1 and col_diff == 2):
            return True

        return False

    async def validate_rook(self, positions, oldPos, newPos):
        directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]

        return await self.validate_directions(positions, oldPos, newPos, directions)

    async def validate_bishop(self, positions, oldPos, newPos):
        directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]]

        return await self.validate_directions(positions, oldPos, newPos, directions)

    async def validate_queen(self, positions, oldPos, newPos):
        directions = [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]

        return await self.validate_directions(positions, oldPos, newPos, directions)

    async def validate_king(self, castling, piece, castle, oldPos, newPos):
        oldRow, oldCol = oldPos
        newRow, newCol = newPos

        row_diff = abs(newRow - oldRow)
        col_diff = abs(newCol - oldCol)

        # Check for castling
        if col_diff == 2 and row_diff == 0 and castle:
            if newCol == 2 and ('Q' if piece[0] == 'w' else 'q') in castling:
                return True
            if newCol == 6 and ('K' if piece[0] == 'w' else 'k') in castling:
                return True

        # Check for one square move
        if (row_diff == 1 and col_diff == 0) or (row_diff == 1 and col_diff == 1) or (row_diff == 0 and col_diff == 1):
            return True

        return False

    async def validate_directions(self, positions, oldPos, newPos, directions):
        """
        Validate directions for rook, bishop and queen.
        Returns True if directions contain move.
        """

        oldRow, oldCol = oldPos
        newRow, newCol = newPos

        # Check for all possible directions
        for direction in directions:
            row = oldRow + direction[0]
            col = oldCol + direction[1]

            while True:
                # Check if row or col went out of board boundaries
                if row < 0 or row > 7 or col < 0 or col > 7:
                    break

                posPiece = positions[row][col]

                # Check if this is position user wants to move to
                if row == newRow and newCol == col:
                    return True
                elif posPiece:
                    break

                row += direction[0]
                col += direction[1]

        return False

    async def get_player_color(self):
        """
        Method used for getting players color.
        Overwrite this method if you have custom way to get players color.
        """

        return 'w' if self.room.white_player == self.user else 'b'

    async def get_game(self):
        """
        Method used for getting game object.
        """

        return await database_sync_to_async(Game.objects.get)(id=self.game_id)


class RankingGameConsumer(GameConsumer):
    async def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['game']
            self.room_group_name = f'ranking_game_{self.room_name}'
            self.user = self.scope['user']

            if self.user.is_authenticated:
                self.room = await database_sync_to_async(RankingGameRoom.objects.prefetch_related('white_player', 'black_player', 'game').get)(id=self.room_name)
                self.game_id = self.room.game.id

                if self.room.white_player == self.user or self.room.black_player == self.user:
                    await self.channel_layer.group_add(
                        self.room_group_name,
                        self.channel_name
                    )

                    return await self.accept()

            await self.close()
        except Exception:
            await self.close()


class GuestGameConsumer(GameConsumer):
    async def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['game']
            self.room_group_name = f'guest_game_{self.room_name}'
            self.user = get_cookie(self.scope, 'guest_game_token')
            self.room = await database_sync_to_async(GuestGameRoom.objects.prefetch_related('game').get)(id=self.room_name)
            self.game_id = self.room.game.id

            if self.user and (self.room.white_player == self.user or self.room.black_player == self.user):
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )

                return await self.accept()

            await self.close()
        except Exception:
            await self.close()


class ComputerGameConsumer(GameConsumer):
    async def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['game']
            self.room_group_name = f'computer_game_{self.room_name}'
            self.user = get_cookie(self.scope, 'computer_game_token')
            self.room = await database_sync_to_async(ComputerGameRoom.objects.prefetch_related('game').get)(id=self.room_name)
            self.game_id = self.room.game.id

            if self.user and self.room.player == self.user:
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )

                return await self.accept()

            await self.close()
        except Exception:
            await self.close()

    async def get_player_color(self):
        return 'w'
