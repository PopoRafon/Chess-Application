import Chat from './Chat';

function PastMovesButtons() {
    return (
        <div className="play-online-sidebar-buttons-container">
            <button className="play-online-sidebar-button">
                <img src="/static/images/new_game_icon.png" alt="New Game" />
            </button>
            <button className="play-online-sidebar-button" style={{margin: "6px"}}>
                <img src="/static/images/move_back_icon.png" alt="Move Back" />
            </button>
            <button className="play-online-sidebar-button">
                <img src="/static/images/move_forward_icon.png" alt="Move Forward" />
            </button>
        </div>
    );
}

function PastMovesContainer({ moves }) {
    return (
        <div className="past-moves-container">
            <div className="past-moves-header">Past Moves</div>
            <div className="past-moves-content">
                <ol>
                    {moves.map((move, index) => (
                        <li className="move" key={index}>
                            {move}
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

function PastMoves({ moves }) {
    return (
        <div className="past-moves">
            <PastMovesContainer moves={moves} />
            <PastMovesButtons />
        </div>
    );
}

function Sidebar({ messages, moves }) {
    return (
        <div className="play-online-page-sidebar">
            <Chat messages={messages} />
            <PastMoves moves={moves} />
        </div>
    );
}

export default Sidebar;
