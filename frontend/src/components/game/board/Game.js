import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../../contexts/UsersContext';
import { useGame } from '../../../contexts/GameContext';
import { SurrenderMenuProvider } from '../../../contexts/SurrenderMenuContext';
import { usePromotionMenu } from '../../../contexts/PromotionMenuContext';
import { useGameSocket } from '../../../contexts/GameSocketContext';
import GameSidebar from '../sidebar/GameSidebar';
import playSound from '../../../helpers/GameSounds';
import PromotionMenu from './PromotionMenu';
import GameInfo from '../extra/GameInfo';
import ChessBoard from './ChessBoard';

export default function Game({ gameType, gameSetup }) {
    const [disableBoard, setDisableBoard] = useState(false);
    const [isGameLoaded, setIsGameLoaded] = useState(false);
    const [messages, setMessages] = useState([]);
    const { promotionMenu } = usePromotionMenu();
    const { gameSocket, setGameSocket } = useGameSocket();
    const { users, setUsers } = useUsers();
    const { game, dispatchGame } = useGame();
    const navigate = useNavigate();

    useEffect(() => {
        const getGameData = async () => {
            const setup = await gameSetup(setGameSocket);

            if (setup !== 'error') {
                const isPlayerWhite = setup.player === 'w';
                const newCastling = isPlayerWhite ? setup.castling[0] + setup.castling[1] : setup.castling[2] + setup.castling[3];

                if (!isPlayerWhite) {
                    setup.prevMoves.map(move => {
                        move[1].map(row => row.reverse());
                        move[1].reverse();
                        move[2][0] = `${Math.abs(parseInt(move[2][0][0] - 7))}${Math.abs(parseInt(move[2][0][1] - 7))}`;
                        move[2][1] = `${Math.abs(parseInt(move[2][1][0] - 7))}${Math.abs(parseInt(move[2][1][1] - 7))}`;
                        return move;
                    });
                    setup.positions.map(row => row.reverse());
                    setup.positions.reverse();
                }

                setUsers({
                    [isPlayerWhite ? 'player' : 'enemy']: {
                        color: 'w',
                        username: setup.white_username,
                        rating: setup.white_rating,
                        timer: setup.white_timer,
                        points: setup.white_points
                    },
                    [!isPlayerWhite ? 'player' : 'enemy']: {
                        color: 'b',
                        username: setup.black_username,
                        rating: setup.black_rating,
                        timer: setup.black_timer,
                        points: setup.black_points
                    }
                });

                dispatchGame({
                    type: 'GAME_START',
                    positions: setup.positions,
                    turn: setup.turn,
                    result: setup.result,
                    castling: newCastling,
                    enPassant: setup.en_passant,
                    prevMoves: setup.prevMoves
                });

                if (gameType === 'ranking') {
                    setMessages(setup.messages);
                }

                setIsGameLoaded(true);
            } else {
                navigate('/');
            }
        }

        getGameData();
    }, [navigate, setMessages, setGameSocket, setUsers, dispatchGame, gameSetup, gameType]);

    useEffect(() => {
        if (gameSocket) {
            gameSocket.onmessage = (message) => {
                const data = JSON.parse(message.data);

                if (data.type === 'move' || data.type === 'promotion' || data.type === 'castle') {
                    const { type, newPos, oldPos, promotionType, turn, move, castling, enPassant, whitePoints, blackPoints } = data;
                    const newPositions = game.positions.slice();
                    const isPlayerWhite = users.player.color === 'w';
                    const lines = isPlayerWhite ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
                    const [oldRow, oldCol, newRow, newCol] = [lines[oldPos[0]], lines[oldPos[1]], lines[newPos[0]], lines[newPos[1]]];
                    const piece = newPositions[oldRow][oldCol];
                    const direction = piece[0] === 'w' ? 1 : -1;
                    let pieceCaptured = newPositions[newRow][newCol];
                    const newMarkedSquares = [
                        `${oldRow}${oldCol}`,
                        `${newRow}${newCol}`
                    ];

                    if (piece[1] === 'p' && oldCol !== newCol && !pieceCaptured) {
                        pieceCaptured = newPositions[lines[newPos[0] + direction]][newCol];
                        newPositions[lines[newPos[0] + direction]][newCol] = '';
                    }

                    if (whitePoints && blackPoints) {
                        setUsers({
                            player: {
                                ...users.player,
                                points: isPlayerWhite ? whitePoints : blackPoints
                            },
                            enemy: {
                                ...users.enemy,
                                points: isPlayerWhite ? blackPoints : whitePoints
                            }
                        });
                    }

                    newPositions[newRow][newCol] = type === 'promotion' ? piece[0] + promotionType : piece;
                    newPositions[oldRow][oldCol] = '';

                    if (type === 'castle') {
                        newPositions[newRow][lines[newPos[1] - (move === 'O-O' ? 1 : -1)]] = piece[0] + 'r';
                        newPositions[newRow][lines[move === 'O-O' ? 7 : 0]] = '';
                    }

                    dispatchGame({
                        type: 'NEXT_ROUND',
                        turn: turn,
                        positions: newPositions,
                        prevMoves: [
                            move,
                            newPositions.map(row => row.slice()),
                            newMarkedSquares
                        ],
                        markedSquares: newMarkedSquares,
                        castling: castling,
                        enPassant: enPassant
                    });

                    playSound(pieceCaptured, type);
                } else if (data.type === 'message') {
                    const { username, body } = data;

                    setMessages((messages) => [
                        ...messages,
                        {
                            username: username,
                            body: body
                        }
                    ]);
                } else if (data.type === 'game_end') {
                    const { result } = data;

                    dispatchGame({
                        type: 'GAME_END',
                        result
                    });
                }
            }

            return () => {
                if (gameSocket) {
                    gameSocket.close();
                }
            };
        }
        // eslint-disable-next-line
    }, [gameSocket]);

    return isGameLoaded && (
        <SurrenderMenuProvider>
            <div className="game-container">
                <div className="game-content">
                    {promotionMenu.show && (
                        <PromotionMenu />
                    )}
                    <GameInfo
                        player='enemy'
                    />
                    <ChessBoard
                        disableBoard={disableBoard}
                        setDisableBoard={setDisableBoard}
                        gameType={gameType}
                    />
                    <GameInfo
                        player='player'
                    />
                </div>
            </div>
            <GameSidebar
                messages={messages}
                gameType={gameType}
                setDisableBoard={setDisableBoard}
            />
        </SurrenderMenuProvider>
    );
}