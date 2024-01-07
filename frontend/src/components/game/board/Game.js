import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../../contexts/UsersContext';
import { useGame } from '../../../contexts/GameContext';
import { useGameSocket } from '../../../contexts/GameSocketContext';
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
                let fen;

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
                    fen = setup.FEN;
                } else {
                    fen = setup.FEN.split(' ');
                    fen[0] = fen[0].split('').reverse().join('');
                    fen = fen.join(' ');
                }

                dispatchGame({
                    type: 'GAME_START',
                    fen: fen,
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
                    const { fen, move } = data;
                    let newFen;

                    if (users.player.color === 'w') {
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