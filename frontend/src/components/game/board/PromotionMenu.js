import { useGame } from '../../../contexts/GameContext';
import { useValidMoves } from '../../../contexts/ValidMovesContext';
import { usePoints } from '../../../contexts/PointsContext';
import { useUsers } from '../../../contexts/UsersContext';

export default function PromotionMenu({ promotionMenu, setPromotionMenu }) {
    const { game, dispatchGame } = useGame();
    const { setValidMoves } = useValidMoves();
    const { data, position } = promotionMenu;
    const { dispatchPoints } = usePoints();
    const { users } = useUsers();
    const [row, col] = position;

    function handleExit() {
        setPromotionMenu({show: false});
    }

    function handlePromote(type) {
        const isPlayerWhite = users.player.color === 'w';
        const [piece, oldRow, oldCol] = data;
        const newPositions = game.positions.slice();
        const capturedPiece = newPositions[row][col];
        const colLetters = (isPlayerWhite ? 'abcdefgh' : 'hgfedcba');
        const rowLetters = (isPlayerWhite ? '87654321' : '12345678');
        const square = colLetters[col] + rowLetters[row];
        const move = square + '=' + type.toUpperCase() + (capturedPiece && 'x' + capturedPiece[1].toUpperCase() + square);

        new Audio('/static/sounds/promote.mp3').play();

        if (newPositions[row][col]) {
            dispatchPoints({
                type: newPositions[row][col],
                turn: game.turn
            });
        }

        newPositions[oldRow][oldCol] = '';
        newPositions[row][col] = piece[0] + type;

        const markedSquares = [`${oldRow}${oldCol}`, `${row}${col}`];

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
            style={{marginTop: `calc(-25px + ${row * 90}px)`, marginLeft: `calc(-70px + ${col * 90}px)`}}
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
