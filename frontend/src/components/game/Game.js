import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PointsProvider } from '../../contexts/PointsContext';
import { useUsers } from '../../contexts/UsersContext';
import { useGame } from '../../contexts/GameContext';
import { useUser } from '../../contexts/UserContext';
import ChessBoard from './ChessBoard';
import PromotionMenu from './PromotionMenu';
import GameSidebar from '../sidebars/GameSidebar';

export default function Game({ gameSetup, isLoaded, disableBoard, setDisableBoard, promotionMenu, setPromotionMenu }) {
    const [isSocketLoaded, setIsSocketLoaded] = useState(false);
    const { setUsers } = useUsers();
    const { dispatchGame } = useGame();
    const navigate = useNavigate();
    const { user } = useUser();
    const socket = useRef();

    useEffect(() => {
        if (isLoaded) {
            const getGameData = async () => {
                const setup = await gameSetup(socket.current, navigate, user);

                if (setup) {
                    setUsers({
                        w: {
                            username: setup.white_username,
                            rating: setup.white_rating,
                            timer: setup.white_timer
                        },
                        b: {
                            username: setup.black_username,
                            rating: setup.black_rating,
                            timer: setup.black_timer
                        }
                    });

                    dispatchGame({
                        type: 'GAME_START',
                        positions: JSON.parse(setup.game_state.replace(/'/g, '"')),
                        turn: setup.turn,
                        result: setup.result
                    });
    
                    setIsSocketLoaded(true);
                }
            }

            getGameData();
        }
    }, [navigate, isLoaded, setUsers, dispatchGame, gameSetup, user]);

    useEffect(() => {
        if (socket.current) {
            socket.current.onmessage = (message) => {
                console.log(message);
            }
        }

        return () => {
            if (socket.current) {
                socket.current.close();
                socket.current = null;
            }
        }
    }, []);

    return isSocketLoaded && (
        <div className="game-container">
            <div className="game-content">
                <PointsProvider>
                    {promotionMenu.show && (
                        <PromotionMenu
                            promotionMenu={promotionMenu}
                            setPromotionMenu={setPromotionMenu}
                        />
                    )}
                    <GameSidebar
                        player='b'
                    />
                    <ChessBoard
                        disableBoard={disableBoard}
                        setDisableBoard={setDisableBoard}
                        setPromotionMenu={setPromotionMenu}
                    />
                    <GameSidebar
                        player='w'
                    />
                </PointsProvider>
            </div>
        </div>
    );
}
