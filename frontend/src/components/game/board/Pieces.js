import { useRef } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useValidMoves } from '../../../contexts/ValidMovesContext';
import { useUsers } from '../../../contexts/UsersContext';
import { useGameSocket } from '../../../contexts/GameSocketContext';
import { usePromotionMenu } from '../../../contexts/PromotionMenuContext';
import calcPosition from '../../../helpers/CalculatePosition';
import Piece from './Piece';

export default function Pieces({ availableMoves }) {
    const { game } = useGame();
    const { validMoves, setValidMoves } = useValidMoves();
    const { setPromotionMenu } = usePromotionMenu();
    const { gameSocket } = useGameSocket();
    const { users } = useUsers();
    const piecesRef = useRef();

    const handleDragOver = (event) => event.preventDefault();

    function handleDrop(event) {
        const [piece, oldRow, oldCol] = event.dataTransfer.getData('text').split(',');
        const [newRow, newCol] = calcPosition(piecesRef.current, event);
        const position = `${oldRow}${oldCol}`;
        const playerMoves = availableMoves.current[piece[0]][position];
        const isPlayerWhite = users.player.color === 'w';
        const lines = isPlayerWhite ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
        const action = (piece[1] === 'k' && Math.abs(oldCol - newCol) === 2) ? 'castle' : 'move';

        setPromotionMenu({ show: false });

        if (playerMoves.some((move) => move.includes(`${newRow}${newCol}`))) {
            if (piece[1] === 'p' && newRow === (isPlayerWhite ? lines[0] : lines[7])) {
                return setPromotionMenu({
                    show: true,
                    data: [oldRow, oldCol],
                    position: [newRow, newCol],
                });
            }

            gameSocket.send(JSON.stringify({
                type: action,
                oldPos: [lines[oldRow], lines[oldCol]],
                newPos: [lines[newRow], lines[newCol]]
            }));

            setValidMoves([]);
        }
    }

    return (
        <div
            ref={piecesRef}
            className="pieces"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {game.markedSquares.map((square, index) => (
                <div
                    className={`highlight p-${square} un-draggable`}
                    key={index}
                >
                </div>
            ))}
            {validMoves.map((square, index) => (
                <div
                    className={`p-${square} un-draggable`}
                    key={index}
                >
                </div>
            ))}
            {game.positions.map((row, rowIdx) => (
                row.map((piece, colIdx) => (
                    piece && (
                        <Piece
                            type={piece}
                            row={rowIdx}
                            col={colIdx}
                            availableMoves={availableMoves}
                            key={`${rowIdx}${colIdx}`}
                        />
                    )
                ))
            ))}
        </div>
    );
}
