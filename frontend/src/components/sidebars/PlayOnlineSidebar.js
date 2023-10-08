import Chat from '../game/Chat';
import PrevMoves from '../game/PreviousMoves';

export default function Sidebar({ messages, setDisableBoard, setPromotionMenu }) {
    return (
        <div className="play-online-page-sidebar">
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
