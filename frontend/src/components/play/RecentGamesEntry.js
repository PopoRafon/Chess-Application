import { useRef } from 'react';

export default function RecentGamesEntry({ game }) {
    const hasWhiteWon = useRef(game.result.includes('white'));
    const hasBlackWon = useRef(game.result.includes('black'));

    return (
        <div className="recent-games-entry">
            <span
                className="recent-games-entry-user"
                style={{ color: `${hasWhiteWon.current ? 'green' : hasBlackWon.current ? 'red' : 'grey'}` }}
            >
                {game.white_player}
            </span>
            <span> {hasWhiteWon.current ? '1 : 0' : hasBlackWon.current ? '0 : 1' : '0 : 0'} </span>
            <span
                className="recent-games-entry-user"
                style={{ color: `${hasBlackWon.current ? 'green' : hasWhiteWon.current ? 'red' : 'grey'}` }}
            >
                {game.black_player}
            </span>
        </div>
    );
}
