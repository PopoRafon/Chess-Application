import { useEffect, useState } from 'react';

export default function RankingTable() {
    const [ranking, setRanking] = useState();

    useEffect(() => {
        fetch('/api/v1/ranking', {
            method: 'GET'
        })
        .then(response => response.json())
        .then((data) => {
            setRanking([...data, ...Array(25 - data.length).fill('')]);
        })
        .catch((error) => {
            console.log(error);
        });
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
                            <th>Win/Lose</th>
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
