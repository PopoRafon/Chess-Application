import Sidebar  from '../components/sidebars/PlaySidebar';
import { useState } from 'react';

export default function Play() {
    const [matchmaking, setMatchmaking] = useState(false);

    return (
        <div className="play-page">
            {matchmaking && (
                <div className="matchmaking">Searching for match...</div>
            )}
            <Sidebar
                setMatchmaking={setMatchmaking}
            />
        </div>
    );
}
