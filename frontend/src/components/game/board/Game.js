import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../../contexts/UsersContext';
import { useGame } from '../../../contexts/GameContext';
import { useGameSocket } from '../../../contexts/GameSocketContext';
import playSound from '../../../helpers/GameSounds';
import GameSidebar from '../sidebar/GameSidebar';
import PromotionMenu from './PromotionMenu';
import GameInfo from '../extra/GameInfo';
import Board from './Board';

export default function Game({ gameType, gameSetup }) {
    const [promotionMenu, setPromotionMenu] = useState({ show: false });
    const [disableBoard, setDisableBoard] = useState(false);
    const [isGameLoaded, setIsGameLoaded] = useState(false);
    const [showResignMenu, setShowResignMenu] = useState(false);
    const [messages, setMessages] = useState([]);
    const { gameSocket, setGameSocket } = useGameSocket();
    const { users, setUsers } = useUsers();
    const { game, dispatchGame } = useGame();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const setup = await gameSetup(setGameSocket);

            if (setup !== 'error') {
                const isPlayerWhite = setup.player === 'w';

                setUsers({
                    [isPlayerWhite ? 'player' : 'enemy']: {
                        color: 'w',
                        avatar: setup.white_avatar,
                        username: setup.white_username,
                        rating: setup.white_rating,
                        timer: setup.white_timer,
                        points: setup.white_points,
                        lastMove: setup.white_last_move
                    },
                    [!isPlayerWhite ? 'player' : 'enemy']: {
                        color: 'b',
                        avatar: setup.black_avatar,
                        username: setup.black_username,
                        rating: setup.black_rating,
                        timer: setup.black_timer,
                        points: setup.black_points,
                        lastMove: setup.black_last_move
                    }
                });

                dispatchGame({
                    type: 'GAME_START',
                    result: setup.result,
                    pgn: setup.pgn
                });

                if (gameType === 'ranking') {
                    setMessages(setup.messages);
                }

                setIsGameLoaded(true);
            } else {
                navigate('/');
            }
        })();
    }, [setDisableBoard, dispatchGame, gameSetup, gameType, navigate, setGameSocket, setUsers]);

    useEffect(() => {
        if (gameSocket) {
            gameSocket.onmessage = (message) => {
                const data = JSON.parse(message.data);

                if (data.type === 'move') {
                    const { move, white_points, black_points } = data;
                    const isPlayerWhite = users.player.color === 'w';

                    dispatchGame({
                        type: 'NEXT_ROUND',
                        move: move,
                        test: game.board
                    });

                    setUsers({
                        [isPlayerWhite ? 'player' : 'enemy']: {
                            ...users[isPlayerWhite ? 'player' : 'enemy'],
                            points: white_points
                        },
                        [!isPlayerWhite ? 'player' : 'enemy']: {
                            ...users[!isPlayerWhite ? 'player' : 'enemy'],
                            points: black_points
                        }
                    });

                    playSound(move);
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
                        result: result
                    });

                    new Audio('/static/sounds/game_end.mp3').play();
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
        <>
            <div className="game-container">
                <div className="game-content">
                    {promotionMenu.show && (
                        <PromotionMenu
                            promotionMenu={promotionMenu}
                            setPromotionMenu={setPromotionMenu}
                        />
                    )}
                    <GameInfo
                        playerType='enemy'
                        gameType={gameType}
                    />
                    <Board
                        disableBoard={disableBoard}
                        setDisableBoard={setDisableBoard}
                        setPromotionMenu={setPromotionMenu}
                        showResignMenu={showResignMenu}
                        setShowResignMenu={setShowResignMenu}
                        gameType={gameType}
                    />
                    <GameInfo
                        playerType='player'
                        gameType={gameType}
                    />
                </div>
            </div>
            <GameSidebar
                messages={messages}
                gameType={gameType}
                setDisableBoard={setDisableBoard}
                setShowResignMenu={setShowResignMenu}
                setPromotionMenu={setPromotionMenu}
            />
        </>
    );
}
