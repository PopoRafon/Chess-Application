import { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../../contexts/UsersContext';
import { useGame } from '../../../contexts/GameContext';
import { useUser } from '../../../contexts/UserContext';
import ChessBoard from './ChessBoard';
import PromotionMenu from './PromotionMenu';
import GameInfo from '../extra/GameInfo';
import playSound from '../../../helpers/GameSounds';
import pointsReducer from '../../../reducers/PointsReducer';

export default function Game({ gameSetup, isLoaded, disableBoard, setDisableBoard, promotionMenu, setPromotionMenu }) {
    const [socket, setSocket] = useState();
    const [points, dispatchPoints] = useReducer(pointsReducer, { w: 0, b: 0 });
    const { users, setUsers } = useUsers();
    const { game, dispatchGame } = useGame();
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded) {
            const getGameData = async () => {
                const setup = await gameSetup(setSocket, navigate, user);

                if (setup) {
                    const isPlayerWhite = setup.player === 'w';

                    if (setup.player === 'b') {
                        setup.positions.map((row) => row.reverse());
                        setup.positions.reverse();
                    }

                    setUsers({
                        [isPlayerWhite ? 'player' : 'enemy']: {
                            color: 'w',
                            username: setup.white_username,
                            rating: setup.white_rating,
                            timer: setup.white_timer
                        },
                        [!isPlayerWhite ? 'player' : 'enemy']: {
                            color: 'b',
                            username: setup.black_username,
                            rating: setup.black_rating,
                            timer: setup.black_timer
                        }
                    });

                    dispatchGame({
                        type: 'GAME_START',
                        positions: setup.positions,
                        turn: setup.turn,
                        result: setup.result
                    });
                }
            }

            getGameData();
        }
    }, [navigate, isLoaded, setUsers, dispatchGame, gameSetup, user]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (message) => {
                const data = JSON.parse(message.data);

                if (!data.error) {
                    const { newPos: [newRow, newCol], oldPos: [oldRow, oldCol], promotionType, turn } = data;
                    const newPositions = game.positions.slice();
                    const isPlayerWhite = users.player.color === 'w';
                    const lines = isPlayerWhite ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
                    const piece = newPositions[lines[oldRow]][lines[oldCol]];
                    const pieceCaptured = newPositions[lines[newRow]][lines[newCol]];

                    newPositions[lines[newRow]][lines[newCol]] = data.type === 'promotion' ? piece[0] + promotionType : piece;
                    newPositions[lines[oldRow]][lines[oldCol]] = '';

                    dispatchGame({
                        type: 'NEXT_ROUND',
                        turn: turn,
                        positions: newPositions,
                        prevMoves: [''],
                        markedSquares: [
                            `${lines[oldRow]}${lines[oldCol]}`,
                            `${lines[newRow]}${lines[newCol]}`
                        ]
                    });

                    playSound(pieceCaptured);
                    dispatchPoints({ type: pieceCaptured });
                }
            }

            return () => {
                if (socket) {
                    socket.close();
                }
            };
        }
        // eslint-disable-next-line
    }, [socket]);

    return socket && (
        <div className="game-container">
            <div className="game-content">
                {promotionMenu.show && (
                    <PromotionMenu
                        socket={socket}
                        promotionMenu={promotionMenu}
                        setPromotionMenu={setPromotionMenu}
                    />
                )}
                <GameInfo
                    player='enemy'
                    points={points}
                />
                <ChessBoard
                    socket={socket}
                    disableBoard={disableBoard}
                    setDisableBoard={setDisableBoard}
                    setPromotionMenu={setPromotionMenu}
                />
                <GameInfo
                    player='player'
                    points={points}
                />
            </div>
        </div>
    );
}
