import PrevMoves from './PrevMoves';
import Chat from './Chat';

export default function GameSidebar({ messages, gameType, setDisableBoard }) {
    return (
        <div className="game-sidebar">
            <PrevMoves
                setDisableBoard={setDisableBoard}
                gameType={gameType}
            />
            {gameType === 'ranking' && (
                <Chat
                    messages={messages}
                />
            )}
        </div>
    );
}
