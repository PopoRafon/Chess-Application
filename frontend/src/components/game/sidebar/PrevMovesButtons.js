import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useGame } from '../../../contexts/GameContext';

export default function PrevMovesButtons({ changePositions, currentMoveIdx, setShowResignMenu, gameType }) {
    const { game } = useGame();
    const [showExitGameTooltip, setShowExitGameTooltip] = useState(false);
    const [showResignTooltip, setShowResignTooltip] = useState(false);
    const [showPrevMoveTooltip, setShowPrevMoveTooltip] = useState(false);
    const [showNextMoveTooltip, setShowNextMoveTooltip] = useState(false);
    const navigate = useNavigate();

    function handleMoveShift(shift) {
        return () => changePositions(currentMoveIdx + shift);
    }

    function handleExitGame() {
        Cookies.remove(`${gameType}_game_url`);
        Cookies.remove(`${gameType}_game_token`);

        navigate('/play');
    }

    return (
        <div className="prev-moves-buttons-container">
            {game.result ? (
                <button
                    className="prev-moves-button"
                    onClick={handleExitGame}
                    onMouseEnter={() => setShowExitGameTooltip(true)}
                    onMouseLeave={() => setShowExitGameTooltip(false)}
                >
                    <img
                        src="/static/images/icons/exit_game_icon.png"
                        alt="Exit Game"
                    />
                    {showExitGameTooltip && <div className="tooltip">Exit Game</div>}
                </button>
            ) : (
                <button
                    className="prev-moves-button"
                    onClick={() => setShowResignMenu(true)}
                    onMouseEnter={() => setShowResignTooltip(true)}
                    onMouseLeave={() => setShowResignTooltip(false)}
                >
                    <img
                        src="/static/images/icons/resign_icon.png"
                        alt="Resign"
                    />
                    {showResignTooltip && <div className="tooltip">Resign</div>}
                </button>
            )}
            <button
                className="prev-moves-button"
                style={{ margin: "6px" }}
                onClick={handleMoveShift(-1)}
                onMouseEnter={() => setShowPrevMoveTooltip(true)}
                onMouseLeave={() => setShowPrevMoveTooltip(false)}
            >
                <img
                    src="/static/images/icons/move_back_icon.png"
                    alt="Move Back"
                />
                {showPrevMoveTooltip && <div className="tooltip">Prev move</div>}
            </button>
            <button
                className="prev-moves-button"
                onClick={handleMoveShift(1)}
                onMouseEnter={() => setShowNextMoveTooltip(true)}
                onMouseLeave={() => setShowNextMoveTooltip(false)}
            >
                <img
                    src="/static/images/icons/move_forward_icon.png"
                    alt="Move Forward"
                />
                {showNextMoveTooltip && <div className="tooltip">Next move</div>}
            </button>
        </div>
    );
}
