import { useEffect, useState } from 'react';
import getRankingPlayers from '#utils/RankingPlayers';

export default function RankingTable() {
    const [ranking, setRanking] = useState();

    useEffect(() => {
        getRankingPlayers(setRanking, 25);
    }, []);

    return ranking && (
        <div className="ranking-container">
            <table className="ranking-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Rating</th>
                        <th>Win/Draw/Lose</th>
                    </tr>
                </thead>
                <tbody>
                    {ranking.map((user, index) => (
                        <tr key={index}>
                            <td style={{ width: '15%' }}>{user && (index + 1)}</td>
                            <td style={{ width: '35%' }}>{user.username}</td>
                            <td style={{ width: '15%' }}>{user.rating}</td>
                            <td style={{ width: '35%' }}>
                                {user && (
                                    <>
                                        <span style={{ color: 'green' }}>{user.wins}</span>
                                        <span> - {user.draws} - </span>
                                        <span style={{ color: 'red' }}>{user.loses}</span>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
