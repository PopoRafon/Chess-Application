import { useState, useEffect } from 'react';

export default function PlayContainer({ matchmaking, setMatchmaking }) {
    const [gameSearchTimer, setGameSearchTimer] = useState(0);

    useEffect(() => {
        if (matchmaking) {
            const gameSearchTimerInterval = setInterval(() => setGameSearchTimer(prev => prev + 1), 1e3);

            return () => {
                setGameSearchTimer(0);
                clearInterval(gameSearchTimerInterval);
            }
        }
    }, [matchmaking]);

    return (
        <section className="play-container">
            {matchmaking && (
                <div className="matchmaking">
                    <span className="matchmaking-timer">
                        {Math.floor(gameSearchTimer / 60).toString().padStart(2, '0')}:{(gameSearchTimer % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="matchmaking-text">Searching for match</span>
                    <button
                        className="matchmaking-leave-button"
                        onClick={() => setMatchmaking(false)}
                    >
                        Leave
                    </button>
                </div>
            )}
            
        </section>
    );
}
