import Sidebar from '../components/sidebars/PlayOnlineSidebar';
import Game from '../components/game/Game';
import { GameProvider } from '../contexts/GameContext';
import { useState } from 'react';
import { ValidMovesProvider } from '../contexts/ValidMovesContext';
import { useUser } from '../contexts/UserContext';

export default function PlayComputer() {
    const [disableBoard, setDisableBoard] = useState(false);
    const [promotionMenu, setPromotionMenu] = useState({ show: false });
    const { user } = useUser();
    const users = [
        {username: 'Bot', rating: 800},
        user.isLoggedIn ? {username: user.username, rating: user.rating} : {username: 'Guest', rating: ''}
    ];

    return (
        <div className="play-page">
            <GameProvider>
                <ValidMovesProvider>
                    <Game
                        users={users}
                        disableBoard={disableBoard}
                        promotionMenu={promotionMenu}
                        setPromotionMenu={setPromotionMenu}
                    />
                    <Sidebar
                        messages={[]}
                        setDisableBoard={setDisableBoard}
                        setPromotionMenu={setPromotionMenu}
                    />
                </ValidMovesProvider>
            </GameProvider>
        </div>
    );
}
