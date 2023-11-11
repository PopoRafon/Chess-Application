import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import GuestGameRoom, RankingGameRoom, ComputerGameRoom, Game, Move, Message
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
    Provides all necessary methods for game compliance.
    """

    async def connect(self):
        """
        This method must be overwritten and must add additional attributes:
        - self.user - User connected to socket.
        - self.room - Room object.
        - self.game_id - Game object id.
        """
        await self.accept()

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
        elif action_type == 'message':
            await self.receive_message(text_data_json)
        else:
            await self.send_error()

    async def send_error(self):
        await self.send(json.dumps({
            'error': 'Message you sent was invalid.'
        }))

    async def receive_message(self, data):
        _, body = data.values()
        body = body.strip()

        self.game = await self.get_game_object()

        if await self.perform_message_validation(body):

            await database_sync_to_async(Message.objects.create)(game=self.game, sender=self.user, body=body)

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                'username': self.user.username,
                'body': body
            })
        else:
            await self.send_error()

    async def receive_castle(self, data):
        _, old_pos, new_pos = data.values()
        self.old_row, self.old_col = old_pos
        self.new_row, self.new_col = new_pos
        self.game = await self.get_game_object()

        if await self.perform_move_validation(castle=True):
            await self.perform_move_creation(castle=True)

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_castle',
                'turn': self.game.turn,
                'castling': self.game.castling,
                'enPassant': self.game.en_passant,
                'oldPos': old_pos,
                'newPos': new_pos,
                'move': self.move
            })
        else:
            await self.send_error()

    async def receive_promotion(self, data):
        _, promotion_type, old_pos, new_pos = data.values()
        self.old_row, self.old_col = old_pos
        self.new_row, self.new_col = new_pos
        self.game = await self.get_game_object()

        if len(promotion_type) == 1 and await self.perform_move_validation(promotion=promotion_type):
            await self.perform_move_creation(promotion=promotion_type)

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_promotion',
                'turn': self.game.turn,
                'promotionType': promotion_type,
                'enPassant': self.game.en_passant,
                'oldPos': old_pos,
                'newPos': new_pos,
                'move': self.move
            })
        else:
            await self.send_error()

    async def receive_move(self, data):
        _, old_pos, new_pos = data.values()
        self.old_row, self.old_col = old_pos
        self.new_row, self.new_col = new_pos
        self.game = await self.get_game_object()

        if await self.perform_move_validation():
            await self.perform_move_creation()

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_move',
                'turn': self.game.turn,
                'castling': self.game.castling,
                'enPassant': self.game.en_passant,
                'oldPos': old_pos,
                'newPos': new_pos,
                'move': self.move
            })
        else:
            await self.send_error()

    async def send_promotion(self, event):
        _, turn, promotion_type, en_passant, old_pos, new_pos, move = event.values()

        await self.send(json.dumps({
            'type': 'promotion',
            'turn': turn,
            'promotionType': promotion_type,
            'enPassant': en_passant,
            'oldPos': old_pos,
            'newPos': new_pos,
            'move': move
        }))

    async def send_move(self, event):
        _, turn, castling, en_passant, old_pos, new_pos, move = event.values()

        await self.send(json.dumps({
            'type': 'move',
            'turn': turn,
            'castling': castling,
            'enPassant': en_passant,
            'oldPos': old_pos,
            'newPos': new_pos,
            'move': move
        }))

    async def send_castle(self, event):
        _, turn, castling, en_passant, old_pos, new_pos, move = event.values()

        await self.send(json.dumps({
            'type': 'castle',
            'turn': turn,
            'castling': castling,
            'enPassant': en_passant,
            'oldPos': old_pos,
            'newPos': new_pos,
            'move': move
        }))

    async def send_message(self, event):
        _, username, body = event.values()

        await self.send(json.dumps({
            'type': 'message',
            'username': username,
            'body': body
        }))

    async def perform_message_validation(self, message):
        """
        Perform all necessary validations for message.
        Returns True if all validations pass.
        """
        if not message:
            return False
        elif len(message) > 255:
            return False

        return True

    async def perform_move_creation(self, promotion='', castle=False):
        """
        Add move to the Database and update current game state.
        """
        piece = self.game.positions[self.old_row][self.old_col]

        await self.add_move_notation_to_game_object(piece, promotion, castle)
        await self.add_en_passant_to_game_object(piece)

        if castle:
            self.game.castling = '--' + self.game.castling[2:4] if piece[0] == 'w' else self.game.castling[0:2] + '--'
            self.game.positions[self.new_row][self.new_col] = piece
            self.game.positions[self.old_row][self.old_col] = ''

            if self.new_col - self.old_col == 2:
                self.game.positions[self.new_row][self.new_col - 1] = piece[0] + 'r'
                self.game.positions[self.new_row][7] = ''
            else:
                self.game.positions[self.new_row][self.new_col + 1] = piece[0] + 'r'
                self.game.positions[self.new_row][0] = ''
        else:
            if piece[1] == 'r':
                if self.old_col == 0:
                    self.game.castling = self.game.castling.replace('Q' if piece[0] == 'w' else 'q', '-')
                if self.old_col == 7:
                    self.game.castling = self.game.castling.replace('K' if piece[0] == 'w' else 'k', '-')
            elif piece[1] == 'k':
                self.game.castling = '--' + self.game.castling[2:4] if piece[0] == 'w' else self.game.castling[0:2] + '--'

            self.game.positions[self.new_row][self.new_col] = piece[0] + promotion if promotion else piece
            self.game.positions[self.old_row][self.old_col] = ''

        await database_sync_to_async(Move.objects.create)(
            game=self.game,
            positions=self.game.positions,
            move=self.move,
            old_pos=f'{self.old_row}{self.old_col}',
            new_pos=f'{self.new_row}{self.new_col}'
        )

        self.game.turn = 'w' if self.game.turn == 'b' else 'b'

        await self.game.asave()

    async def add_king_check_to_game_object(self):
        """
        Method used for checking if king is in check and adding it
        to the game object.
        """
        pass

    async def add_en_passant_to_game_object(self, piece):
        """
        Method used for adding new en passant position to the game object
        and checking if en passant capture occured.
        """
        self.game.en_passant = ''
        direction = 1 if piece[0] == 'w' else -1

        if piece[1] == 'p':
            if self.new_col != self.old_col and not self.game.positions[self.new_row][self.new_col]:
                self.game.positions[self.new_row + direction][self.new_col] = ''
            elif abs(self.new_row - self.old_row) == 2:
                self.game.en_passant = f'{self.new_row + direction}{self.new_col}'

    async def add_move_notation_to_game_object(self, piece, promotion, castle):
        """
        Method used for creating move notation and adding it to the game object.
        """
        if castle:
            self.move = 'O-O' if self.new_col - self.old_col == 2 else 'O-O-O'
        else:            
            new_pos_piece = self.game.positions[self.new_row][self.new_col]

            col_letters = 'abcdefgh'
            row_letters = '87654321'

            self.move = piece[1].upper() if piece[1] != 'p' else ''

            if new_pos_piece:
                if not self.move:
                    self.move += col_letters[self.old_col]
                self.move += 'x'

            self.move += f'{col_letters[self.new_col]}{row_letters[self.new_row]}'

            if promotion:
                self.move += f'={promotion.upper()}'

    async def perform_move_validation(self, promotion='', castle=False):
        """
        Perform every validation needed for received move.
        Returns True if all validations pass.
        """
        piece = self.game.positions[self.old_row][self.old_col]

        if not self.perform_basic_validation(piece, promotion):
            return False

        match piece[1]:
            case 'p':
                return await self.validate_pawn(piece)
            case 'n':
                return await self.validate_knight()
            case 'r':
                return await self.validate_rook()
            case 'b':
                return await self.validate_bishop()
            case 'q':
                return await self.validate_queen()
            case 'k':
                return await self.validate_king(piece, castle)
            case _:
                return await self.send_error()

    async def perform_basic_validation(self, piece, promotion):
        """
        Perform all basic validations for player and his move.
        """
        new_pos_piece = self.game.positions[self.new_row][self.new_col]

        if await self.get_player_color() != piece[0]:
            return False
        elif piece[0] != self.game.turn:
            return False
        elif self.game.king_check == piece[0] and piece[1] != 'k':
            return False
        elif new_pos_piece and piece[0] == new_pos_piece[0]:
            return False
        elif self.new_row < 0 or self.new_row > 7 or self.new_col < 0 or self.new_col > 7:
            return False
        elif promotion and promotion != 'q' and promotion != 'r' and promotion != 'b' and promotion != 'n':
            return False
        elif piece[1] == 'p':
            if not promotion and ((piece[0] == 'w' and self.new_row == 0) or (piece[0] == 'b' and self.new_row == 7)):
                return False
            elif promotion and ((piece[0] == 'w' and self.new_row != 0) or (piece[0] == 'b' and self.new_row != 7)):
                return False

        return True

    async def validate_pawn(self, piece):
        direction = 1 if piece[0] == 'w' else -1
        starting_pos = 6 if piece[0] == 'w' else 1

        # Check for one tile move
        if self.old_row - self.new_row == direction and \
            self.old_col == self.new_col and \
            not self.game.positions[self.new_row][self.new_col]:
            return True
        # Check for two tiles move from starting position
        elif self.old_row == starting_pos and \
            self.old_row - self.new_row == direction * 2 and \
            self.old_col == self.new_col and \
            not self.game.positions[self.new_row][self.new_col]:
            return True
        # Check for diagonal capture
        elif self.old_row - self.new_row == direction and \
            abs(self.old_col - self.new_col) == 1 and \
            self.game.positions[self.new_row][self.new_col]:
            return True
        # Check for en passant
        elif f'{self.new_row}{self.new_col}' == self.game.en_passant:
            return True

        return False

    async def validate_knight(self):
        row_diff = abs(self.new_row - self.old_row)
        col_diff = abs(self.new_col - self.old_col)

        if (row_diff == 2 and col_diff == 1) or (row_diff == 1 and col_diff == 2):
            return True

        return False

    async def validate_rook(self):
        directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]

        return await self.validate_directions(directions)

    async def validate_bishop(self):
        directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]]

        return await self.validate_directions(directions)

    async def validate_queen(self):
        directions = [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]

        return await self.validate_directions(directions)

    async def validate_king(self, piece, castle):
        row_diff = abs(self.new_row - self.old_row)
        col_diff = abs(self.new_col - self.old_col)

        # Check for castling
        if col_diff == 2 and row_diff == 0 and castle:
            if self.new_col == 2 and ('Q' if piece[0] == 'w' else 'q') in self.game.castling:
                return True
            if self.new_col == 6 and ('K' if piece[0] == 'w' else 'k') in self.game.castling:
                return True

        # Check for one square move
        if (row_diff == 1 and col_diff == 0) or (row_diff == 1 and col_diff == 1) or (row_diff == 0 and col_diff == 1):
            return True

        return False

    async def validate_directions(self, directions):
        """
        Validate directions for rook, bishop and queen.
        Returns True if directions contain move.
        """
        # Check for all possible directions
        for direction in directions:
            row = self.old_row + direction[0]
            col = self.old_col + direction[1]

            while True:
                # Check if row or col went out of board boundaries
                if row < 0 or row > 7 or col < 0 or col > 7:
                    break

                pos_piece = self.game.positions[row][col]

                # Check if this is position user wants to move to
                if row == self.new_row and self.new_col == col:
                    return True
                elif pos_piece:
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

    async def get_game_object(self):
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
