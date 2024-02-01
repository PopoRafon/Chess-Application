import { useState, useEffect } from 'react';
import getRankingPlayers from '#utils/RankingPlayers';
import HomeRankingPlayer from './HomeRankingPlayer';

export default function HomeRanking() {
    const [topPlayers, setTopPlayers] = useState(new Array(3).fill(null));

    useEffect(() => {
        getRankingPlayers(setTopPlayers, 3);
    }, [setTopPlayers]);

    return (
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
    );
}
