import ChessBoard from './ChessBoard';
import PromotionMenu from './PromotionMenu';
import GameSidebar from '../sidebars/GameSidebar';
import { PointsProvider } from '../../contexts/PointsContext';

export default function Game({ users, disableBoard, promotionMenu, setPromotionMenu }) {
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
                        user={users[0].username}
                        rating={users[0].rating}
                    />
                    <ChessBoard
                        disableBoard={disableBoard}
                        setPromotionMenu={setPromotionMenu}
                    />
                    <GameSidebar
                        player='w'
                        user={users[1].username}
                        rating={users[1].rating}
                    />
                </PointsProvider>
            </div>
        </div>
    );
}
