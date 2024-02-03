import PrevMoves from './PrevMoves';
import Chat from './Chat';

export default function GameSidebar({ messages, gameType, setDisableBoard, setShowResignMenu, setPromotionMenu }) {
    return (
        <aside className="game-sidebar">
            <Chat
                gameType={gameType}
                messages={messages}
            />
            <PrevMoves
                setDisableBoard={setDisableBoard}
                setPromotionMenu={setPromotionMenu}
                setShowResignMenu={setShowResignMenu}
                gameType={gameType}
            />
        </aside>
    );
}
