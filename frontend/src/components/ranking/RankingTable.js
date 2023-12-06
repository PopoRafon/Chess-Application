import { useEffect, useState } from 'react';
import getRankingPlayers from '../../utils/RankingPlayers';

export default function RankingTable() {
    const [ranking, setRanking] = useState();

    useEffect(() => {
        getRankingPlayers(setRanking, 25);
    }, []);

    return ranking && (
        <div className="ranking-page">
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
                                <td>{user && (index + 1)}</td>
                                <td>{user.username}</td>
                                <td>{user.rating}</td>
                                <td>
                                    <span style={{ color: 'green' }}>{user.wins}</span>
                                    <span>{user ? ' - ' : <wbr />}</span>
                                    <span style={{ color: 'grey' }}>{user.draws}</span>
                                    <span>{user ? ' - ' : <wbr />}</span>
                                    <span style={{ color: 'red' }}>{user.loses}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
