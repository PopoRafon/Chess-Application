import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PointsProvider } from '../../../contexts/PointsContext';
import { useUsers } from '../../../contexts/UsersContext';
import { useGame } from '../../../contexts/GameContext';
import { useUser } from '../../../contexts/UserContext';
import ChessBoard from './ChessBoard';
import PromotionMenu from './PromotionMenu';
import GameInfo from '../extra/GameInfo';

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
                const setup = await gameSetup(socket, navigate, user);

                if (setup) {
                    let positions = JSON.parse(setup.game_state.replace(/'/g, '"'));

                    if (setup.player === 'b') {
                        positions.map((row) => row.reverse());
                        positions.reverse();
                    }

                    setUsers({
                        [setup.player === 'w' ? 'player' : 'enemy']: {
                            color: 'w',
                            username: setup.white_username,
                            rating: setup.white_rating,
                            timer: setup.white_timer
                        },
                        [setup.player === 'b' ? 'player' : 'enemy']: {
                            color: 'b',
                            username: setup.black_username,
                            rating: setup.black_rating,
                            timer: setup.black_timer
                        }
                    });

                    dispatchGame({
                        type: 'GAME_START',
                        positions: positions,
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
                    <GameInfo
                        player='enemy'
                    />
                    <ChessBoard
                        disableBoard={disableBoard}
                        setDisableBoard={setDisableBoard}
                        setPromotionMenu={setPromotionMenu}
                    />
                    <GameInfo
                        player='player'
                    />
                </PointsProvider>
            </div>
        </div>
    );
}
