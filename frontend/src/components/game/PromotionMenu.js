import { useGame } from '../../contexts/GameContext';
import { useValidMoves } from '../../contexts/ValidMovesContext';

export default function PromotionMenu({ promotionMenu, setPromotionMenu }) {
    const { game, dispatchGame } = useGame();
    const { setValidMoves } = useValidMoves();
    const { data, position } = promotionMenu;
    const [row, col] = position;

    function handleExit() {
        setPromotionMenu({show: false});
    }

    function handlePromote(type) {
        const newPositions = game.positions.slice();
        const capturedPiece = newPositions[row][col];
        const square = 'abcdefgh'[col] + '87654321'[row];
        const move = square + '=' + type.toUpperCase() + (capturedPiece ? 'x' + capturedPiece[1].toUpperCase() + square : '');

        new Audio('/static/sounds/promote.mp3').play();

        newPositions[data[1]][data[2]] = '';
        newPositions[row][col] = data[0][0] + type;

        const markedSquares = [`${data[1]}${data[2]}`, `${row}${col}`];

        setValidMoves([]);

        dispatchGame({
            type: 'NEXT_ROUND',
            positions: newPositions,
            prevMove: [
                move,
                newPositions.map(row => row.slice()),
                markedSquares
            ],
            markedSquares: markedSquares
        });

        setPromotionMenu({show: false});
    }

    return (
        <div
            className="promotion-menu"
            style={{
                top: `${((row - 1) * 90 + 25) + (window.innerHeight * 0.11)}px`,
                left: `${((col - 1) * 90 + 25) + (window.innerWidth * 0.27)}px`
            }}
        >
            {['q', 'r', 'b', 'n'].map((type) => (
                <button
                    key={type}
                    className={`promotion-${type}-field promotion-field-${game.turn}`}
                    onClick={() => handlePromote(`${type}`)}
                    >
                    <div className={`promotion-${type}-piece ${game.turn}${type}`}></div>
                </button>
            ))}
            <button
                className="promotion-exit-button"
                onClick={handleExit}
            />
        </div>
    );
}
