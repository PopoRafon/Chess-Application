import { useState } from 'react';
import PlaySidebar from '../components/play/PlaySidebar';

export default function Play() {
    const [matchmaking, setMatchmaking] = useState(false);

    return (
        <div className="play-page">
            <div className="play-page-container">
                {matchmaking && <div className="matchmaking">Searching for match</div>}
            </div>
            <PlaySidebar
                setMatchmaking={setMatchmaking}
            />
        </div>
    );
}
