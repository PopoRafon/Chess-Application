import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useSurrenderMenu } from '../../../contexts/SurrenderMenuContext';
import { useGame } from '../../../contexts/GameContext';

export default function PrevMovesButtons({ changePositions, currentMoveIdx, gameType }) {
    const { game } = useGame();
    const { setSurrenderMenu } = useSurrenderMenu();
    const [exitGame, setExitGame] = useState(false);
    const [surrender, setSurrender] = useState(false);
    const [prevMove, setPrevMove] = useState(false);
    const [nextMove, setNextMove] = useState(false);
    const navigate = useNavigate();

    function handleMoveShift(shift) {
        return () => changePositions(currentMoveIdx + shift);
    }

    function handleExitGame() {
        if (gameType === 'ranking') {
            Cookies.remove('ranking_game_url');
        } else if (gameType === 'guest') {
            Cookies.remove('guest_game_token');
            Cookies.remove('guest_game_url');
        } else {
            Cookies.remove('computer_game_token');
            Cookies.remove('computer_game_url');
        }

        navigate('/play');
    }

    return (
        <div className="prev-moves-buttons-container">
            {game.result ? (
                <button
                    className="prev-moves-button"
                    onClick={handleExitGame}
                    onMouseEnter={() => setExitGame(true)}
                    onMouseLeave={() => setExitGame(false)}
                >
                    <img src="/static/images/icons/exit_game_icon.png" alt="Exit Game" />
                    {exitGame && <div className="tooltip">Exit Game</div>}
                </button>
            ) : (
                <button
                    className="prev-moves-button"
                    onClick={() => setSurrenderMenu(true)}
                    onMouseEnter={() => setSurrender(true)}
                    onMouseLeave={() => setSurrender(false)}
                >
                    <img style={{ width: '25px', height: '25px' }} src="/static/images/icons/surrender_icon.png" alt="Surrender" />
                    {surrender && <div className="tooltip">Surrender</div>}
                </button>
            )}
            <button
                className="prev-moves-button"
                style={{ margin: "6px" }}
                onClick={handleMoveShift(-1)}
                onMouseEnter={() => setPrevMove(true)}
                onMouseLeave={() => setPrevMove(false)}
            >
                <img src="/static/images/icons/move_back_icon.png" alt="Move Back" />
                {prevMove && <div className="tooltip">Prev move</div>}
            </button>
            <button
                className="prev-moves-button"
                onClick={handleMoveShift(1)}
                onMouseEnter={() => setNextMove(true)}
                onMouseLeave={() => setNextMove(false)}
            >
                <img src="/static/images/icons/move_forward_icon.png" alt="Move Forward" />
                {nextMove && <div className="tooltip">Next move</div>}
            </button>
        </div>
    );
}
