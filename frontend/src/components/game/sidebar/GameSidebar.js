import Chat from './Chat';
import PrevMoves from './PreviousMoves';

export default function Sidebar({ messages, setDisableBoard, setPromotionMenu }) {
    return (
        <div className="game-sidebar">
            <Chat
                messages={messages}
            />
            <PrevMoves
                setDisableBoard={setDisableBoard}
                setPromotionMenu={setPromotionMenu}
            />
        </div>
    );
}
