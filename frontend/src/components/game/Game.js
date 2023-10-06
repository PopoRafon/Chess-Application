import ChessBoard from './ChessBoard';
import { useState } from 'react';
import PromotionMenu from './PromotionMenu';
import { useUser } from '../../contexts/UserContext';

function GameSidebar() {
    const { user } = useUser();

    return (
        <div className="game-sidebar">
            <img
                src='/static/images/avatar.png'
                className="game-user-avatar"
                alt="Avatar"
            />
                {user.isLoggedIn ? (
                    <div>
                        <span>{user.username}</span>
                        <span className="game-user-rating">(800)</span>
                    </div>

                ) : (
                    <span>Guest</span>
                )}
            <div className="game-timer">10:00</div>
        </div>
    );
}

export default function Game({ disableBoard }) {
    const [promotionMenu, setPromotionMenu] = useState({show: false});

    return (
        <div className="game-container">
            <div className="game-content">
                {promotionMenu.show && (
                    <PromotionMenu
                        promotionMenu={promotionMenu}
                        setPromotionMenu={setPromotionMenu}
                    />
                )}
                <GameSidebar />
                <ChessBoard
                    disableBoard={disableBoard}
                    setPromotionMenu={setPromotionMenu}
                />
                <GameSidebar />
            </div>
        </div>
    );
}
