import { useState, useEffect } from 'react';
import getRankingPlayers from '../utils/RankingPlayers';

export default function Home() {
    const [topPlayers, setTopPlayers] = useState([]);

    useEffect(() => {
        getRankingPlayers(setTopPlayers, 3);
    }, [setTopPlayers]);

    return (
        <div className="home-page">
            <div className="home-ranking">
                <h2 className="home-ranking-header">Top Players</h2>
                <ul className="home-ranking-body">
                    {topPlayers.map((player, index) => (
                        <li
                            className="home-ranking-player"
                            key={index}
                        >
                            {player && (
                                <>
                                    <img
                                        className="home-ranking-avatar"
                                        src={player.avatar}
                                        alt={`${player.username} Avatar`}
                                    />
                                    <span>#{index + 1}</span>
                                    <span className="home-ranking-username">{player.username}</span>
                                    <span style={{ fontSize: 'medium' }}>Rating: {player.rating}</span>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="home-container">
                <h1 className="home-header">
                    Welcome to our world of strategic brilliance and timeless battles!<br/>
                </h1>
                <div className="home-body">
                    <span>Dive into a world where strategy meets passion, and every game brings forth a thrilling tale.</span>
                    <span>Challenge opponents from across the globe or sharpen your skills against our AI.</span>
                </div>
            </div>
        </div>
    );
}
