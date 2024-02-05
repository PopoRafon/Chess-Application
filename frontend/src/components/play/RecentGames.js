import { useEffect, useState } from 'react';
import { useUser } from '#contexts/UserContext';
import Cookies from 'js-cookie';
import RecentGamesEntry from './RecentGamesEntry';

export default function RecentGames() {
    const { user } = useUser();
    const [recentGames, setRecentGames] = useState([]);

    useEffect(() => {
        if (user.isLoggedIn) {
            const accessToken = Cookies.get('access');

            fetch('/api/v1/user/games/history', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then((response) => response.json())
            .then((data) => {
                if (!data.detail) {
                    setRecentGames(data);
                }
            });
        }
    }, [user.isLoggedIn]);

    return user.isLoggedIn && (
        <div className="recent-games">
            <h2 className="recent-games-header">Recent Games</h2>                    
            <div className="recent-games-body">
                {recentGames.map((game, index) => (
                    <RecentGamesEntry
                        game={game}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
}
