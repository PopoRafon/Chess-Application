import ChessBoard from './ChessBoard';
import PromotionMenu from './PromotionMenu';
import GameSidebar from './GameSidebar';
import { useUser } from '../../contexts/UserContext';
import { usePoints } from '../../contexts/PointsContext';

export default function Game({ disableBoard, promotionMenu, setPromotionMenu }) {
    const { user } = useUser();
    const { points } = usePoints();

    return (
        <div className="game-container">
            <div className="game-content">
                {promotionMenu.show && (
                    <PromotionMenu
                        promotionMenu={promotionMenu}
                        setPromotionMenu={setPromotionMenu}
                    />
                )}
                <GameSidebar
                    user='Bot'
                    points={points.b}
                />
                <ChessBoard
                    disableBoard={disableBoard}
                    setPromotionMenu={setPromotionMenu}
                />
                <GameSidebar
                    user={user.isLoggedIn ? user.username : 'Guest'}
                    rating='800'
                    points={points.w}
                />
            </div>
        </div>
    );
}
