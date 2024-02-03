import { useState } from 'react';
import PlayContainer from '#components/play/PlayContainer';
import PlaySidebar from '#components/play/PlaySidebar';

export default function Play() {
    const [matchmaking, setMatchmaking] = useState(false);

    return (
        <main className="play-page">
            <PlayContainer
                matchmaking={matchmaking}
                setMatchmaking={setMatchmaking}
            />
            <PlaySidebar
                matchmaking={matchmaking}
                setMatchmaking={setMatchmaking}
            />
        </main>
    );
}
