import { useState, useEffect } from 'react';
import getRankingPlayers from '#utils/RankingPlayers';
import TopPlayer from './TopPlayer';

export default function TopPlayersRanking() {
    const [topPlayers, setTopPlayers] = useState(new Array(3).fill(null));

    useEffect(() => {
        getRankingPlayers(setTopPlayers, 3);
    }, [setTopPlayers]);

    return (
        <section className="top-players-ranking">
            <h2 className="top-players-header">Top Players</h2>
            <ul className="top-players-body">
                {topPlayers.map((player, index) => (
                    <TopPlayer
                        player={player}
                        position={index + 1}
                        key={index}
                    />
                ))}
            </ul>
        </section>
    );
}
