import Sidebar  from '../components/sidebars/PlaySidebar';
import Navigation from '../components/sidebars/Navigation';
import { useState } from 'react';

export default function Play({ isLoaded }) {
    const [matchmaking, setMatchmaking] = useState(false);

    return isLoaded && (
        <>
            <Navigation />
            <div className="play-page">
                {matchmaking && (
                    <div className="matchmaking">Searching for match</div>
                )}
                <Sidebar
                    setMatchmaking={setMatchmaking}
                />
            </div>
        </>
    );
}
