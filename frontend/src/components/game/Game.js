import ChessBoard from './ChessBoard';
import PromotionMenu from './PromotionMenu';
import GameSidebar from './GameSidebar';

export default function Game({ disableBoard, promotionMenu, setPromotionMenu }) {
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
