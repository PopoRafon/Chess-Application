export default function GameSidebar({ user, rating, points }) {
    return (
        <div className="game-sidebar">
            <img
                src='/static/images/avatar.png'
                className="game-user-avatar"
                alt="Avatar"
            />
            <div className="player-information">
                <span>{user}</span>
                {rating ? (
                    <span className="game-user-rating">({rating})</span>
                ) : (
                    ''
                )}
                <div className="game-points">Points: +{points ? points : '0'}</div>
            </div>
            <div className="game-timer">10:00</div>
        </div>
    );
}
