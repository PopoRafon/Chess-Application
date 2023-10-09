import ChessBoard from './ChessBoard';
import PromotionMenu from './PromotionMenu';
import GameSidebar from './GameSidebar';
import { useUser } from '../../contexts/UserContext';
import { PointsProvider } from '../../contexts/PointsContext';

export default function Game({ disableBoard, promotionMenu, setPromotionMenu }) {
    const { user } = useUser();

    return (
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
                        user='Bot'
                    />
                    <ChessBoard
                        disableBoard={disableBoard}
                        setPromotionMenu={setPromotionMenu}
                    />
                    <GameSidebar
                        player='w'
                        user={user.isLoggedIn ? user.username : 'Guest'}
                        rating='800'
                    />
                </PointsProvider>
            </div>
        </div>
    );
}
