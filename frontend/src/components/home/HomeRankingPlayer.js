export default function HomeRankingPlayer({ player, position }) {
    return (
        <li className="home-ranking-player">
            {player && (
                <>
                    <img
                        className="home-ranking-avatar"
                        src={player.avatar}
                        alt={`${player.username} Avatar`}
                    />
                    <span>#{position}</span>
                    <span className="home-ranking-username">{player.username}</span>
                    <span>Rating: {player.rating}</span>
                </>
            )}
        </li>
    );
}
