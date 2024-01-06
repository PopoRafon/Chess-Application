import { Chess } from 'chess.js';
import { useRef } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useGameSocket } from '../../../contexts/GameSocketContext';
import calcPosition from '../../../helpers/CalculatePosition';
import Piece from './Piece';

export default function Pieces({ setPromotionMenu }) {
    const { game } = useGame();
    const { gameSocket } = useGameSocket();
    const piecesRef = useRef();

    const handleDragOver = (event) => event.preventDefault();

    function handleDrop(event) {
        const [type, oldRow, oldCol] = event.dataTransfer.getData('text').split(',');
        const [newRow, newCol] = calcPosition(piecesRef.current, event);
        setPromotionMenu({ show: false });

        if (type[1] === 'p' && (newRow === 7 || newRow === 0)) {
            setPromotionMenu({
                show: true,
                oldPos: [oldRow, oldCol],
                newPos: [newRow, newCol],
            });
        } else {
            gameSocket.send(JSON.stringify({
                type: 'move',
                move: 'abcdefgh'[oldCol] + '87654321'[oldRow] + 'abcdefgh'[newCol] + '87654321'[newRow]
            }));
        }
    }

    return (
        <div
            ref={piecesRef}
            className="pieces"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {new Chess(game.fen).board().map((row, rowIdx) => (
                row.map((piece, colIdx) => (
                    piece && (
                        <Piece
                            type={`${piece.color}${piece.type}`}
                            row={rowIdx}
                            col={colIdx}
                            key={`${rowIdx}${colIdx}`}
                        />
                    )
                ))
            ))}
        </div>
    );
}
