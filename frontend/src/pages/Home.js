import { useState, useEffect } from 'react';
import getRankingPlayers from '#utils/RankingPlayers';
import HomeRankingPlayer from '#components/home/HomeRankingPlayer';

export default function Home() {
    const [topPlayers, setTopPlayers] = useState(new Array(3).fill(null));

    useEffect(() => {
        getRankingPlayers(setTopPlayers, 3);
    }, [setTopPlayers]);

    return (
        <div className="home-page">
            <section className="home-ranking">
                <h2 className="home-ranking-header">Top Players</h2>
                <ul className="home-ranking-body">
                    {topPlayers.map((player, index) => (
                        <HomeRankingPlayer
                            player={player}
                            position={index + 1}
                            key={index}
                        />
                    ))}
                </ul>
            </section>
            <section className="home-container">
                <h1 className="home-header">
                    Welcome to our world of strategic brilliance and timeless battles!
                </h1>
                <div className="home-body">
                    <span>Dive into a world where strategy meets passion, and every game brings forth a thrilling tale.</span>
                    <span>Challenge opponents from across the globe or sharpen your skills against our AI.</span>
                </div>
            </section>
        </div>
    );
}
