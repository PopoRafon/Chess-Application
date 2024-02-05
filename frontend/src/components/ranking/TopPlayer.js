export default function TopPlayer({ player, position }) {
    return (
        <li className="top-player">
            {player && (
                <>
                    <img
                        className="top-player-avatar"
                        src={player.avatar}
                        alt={`${player.username} Avatar`}
                    />
                    <span>#{position}</span>
                    <span className="top-player-username">{player.username}</span>
                    <span>Rating: {player.rating}</span>
                </>
            )}
        </li>
    );
}
