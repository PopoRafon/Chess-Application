import { useRef } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useValidMoves } from '../../../contexts/ValidMovesContext';
import { useUsers } from '../../../contexts/UsersContext';
import calcPosition from '../../../helpers/CalculatePosition';
import Piece from './Piece';

export default function Pieces({ socket, setPromotionMenu, availableMoves }) {
    const { game } = useGame();
    const { validMoves, setValidMoves } = useValidMoves();
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

        setPromotionMenu({ show: false });

        if (playerMoves.some((move) => move.includes(`${newRow}${newCol}`))) {
            if ((piece === 'wp' && newRow === (isPlayerWhite ? 0 : 7)) || (piece === 'bp' && newRow === (isPlayerWhite ? 7 : 0))) {
                return setPromotionMenu({
                    show: true,
                    data: [oldRow, oldCol],
                    position: [newRow, newCol],
                });
            }

            socket.send(JSON.stringify({
                type: 'move',
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
                    className={`highlight p-${square}`}
                    key={index}
                >
                </div>
            ))}
            {validMoves.map((square, index) => (
                <div
                    className={`p-${square}`}
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
