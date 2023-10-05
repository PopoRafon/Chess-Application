import { usePositions } from '../../contexts/PositionsContext';
import { usePrevMoves } from '../../contexts/PreviousMovesContext';

export default function PromotionMenu({ promotionMenu, setPromotionMenu }) {
    const { setPositions } = usePositions();
    const { prevMoves, setPrevMoves } = usePrevMoves();
    const { data, newPositions, position, turn, setTurn } = promotionMenu;
    const [row, col] = position;

    function handleExit() {
        setPromotionMenu({show: false});
    }

    function handlePromote(type) {
        const capturedPiece = newPositions[row][col];
        const square = 'abcdefgh'[col] + '87654321'[row];
        let move;

        if (capturedPiece) {
            move = square + '=' + type.toUpperCase() + 'x' + capturedPiece[1].toUpperCase() + square;
        } else {
            move = square + '=' + type.toUpperCase();
        }

        newPositions[data[1]][data[2]] = '';
        newPositions[row][col] = data[0][0] + type;

        setPositions(newPositions);

        setPrevMoves([
            ...prevMoves,
            [move, newPositions.map(row => row.slice())]
        ]);

        turn === 'w' ? setTurn('b') : setTurn('w');
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
                    className={`promotion-${type}-field promotion-field-${turn}`}
                    onClick={() => handlePromote(`${type}`)}
                    >
                    <div className={`promotion-${type}-piece ${turn}${type}`}></div>
                </button>
            ))}
            <button
                className="promotion-exit-button"
                onClick={handleExit}
            />
        </div>
    );
}
