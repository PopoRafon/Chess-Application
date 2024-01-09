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
    const [showSurrenderMenu, setShowSurrenderMenu] = useState(false);
    const [messages, setMessages] = useState([]);
    const { gameSocket, setGameSocket } = useGameSocket();
    const { users, setUsers } = useUsers();
    const { dispatchGame } = useGame();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const setup = await gameSetup(setGameSocket);

            if (setup !== 'error') {
                const isPlayerWhite = setup.player === 'w';
                let newFen;

                setUsers({
                    [isPlayerWhite ? 'player' : 'enemy']: {
                        color: 'w',
                        avatar: setup.white_avatar,
                        username: setup.white_username,
                        rating: setup.white_rating,
                        timer: setup.white_timer,
                        points: setup.white_points
                    },
                    [!isPlayerWhite ? 'player' : 'enemy']: {
                        color: 'b',
                        avatar: setup.black_avatar,
                        username: setup.black_username,
                        rating: setup.black_rating,
                        timer: setup.black_timer,
                        points: setup.black_points
                    }
                });

                if (isPlayerWhite) {
                    newFen = setup.fen;
                } else {
                    newFen = setup.fen.split(' ');
                    newFen[0] = newFen[0].split('').reverse().join('');
                    newFen = newFen.join(' ');
                }

                dispatchGame({
                    type: 'GAME_START',
                    fen: newFen,
                    result: setup.result,
                    prevMoves: setup.prevMoves
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
                    const { fen, move, white_points, black_points } = data;
                    const isPlayerWhite = users.player.color === 'w';
                    let newFen;

                    if (isPlayerWhite) {
                        newFen = fen;
                    } else {
                        newFen = fen.split(' ');
                        newFen[0] = newFen[0].split('').reverse().join('');
                        newFen = newFen.join(' ');
                    }

                    dispatchGame({
                        type: 'NEXT_ROUND',
                        fen: newFen,
                        prevMoves: [
                            move,
                            fen,
                        ]
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
                        result
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
                        player='enemy'
                        gameType={gameType}
                    />
                    <Board
                        disableBoard={disableBoard}
                        setDisableBoard={setDisableBoard}
                        setPromotionMenu={setPromotionMenu}
                        showSurrenderMenu={showSurrenderMenu}
                        setShowSurrenderMenu={setShowSurrenderMenu}
                        gameType={gameType}
                    />
                    <GameInfo
                        player='player'
                        gameType={gameType}
                    />
                </div>
            </div>
            <GameSidebar
                messages={messages}
                gameType={gameType}
                setDisableBoard={setDisableBoard}
                setShowSurrenderMenu={setShowSurrenderMenu}
                setPromotionMenu={setPromotionMenu}
            />
        </>
    );
}