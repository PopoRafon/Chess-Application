import PrevMoves from './PrevMoves';
import Chat from './Chat';

export default function GameSidebar({ messages, gameType, setDisableBoard, setShowSurrenderMenu, setPromotionMenu }) {
    return (
        <div className="game-sidebar">
            {gameType === 'ranking' ? (
                <Chat
                    messages={messages}
                />
            ) : (
                <div style={{ width: '350px', height: '350px' }}></div>
            )}
            <PrevMoves
                setDisableBoard={setDisableBoard}
                setPromotionMenu={setPromotionMenu}
                setShowSurrenderMenu={setShowSurrenderMenu}
                gameType={gameType}
            />
        </div>
    );
}
