import { useState } from 'react';
import Sidebar from '../components/play/PlaySidebar';
import Navigation from '../components/core/Navigation';

export default function Play({ isLoaded }) {
    const [matchmaking, setMatchmaking] = useState(false);

    return isLoaded && (
        <>
            <Navigation />
            <div className="play-page">
                {matchmaking && <div className="matchmaking">Searching for match</div>}
                <Sidebar
                    setMatchmaking={setMatchmaking}
                />
            </div>
        </>
    );
}
