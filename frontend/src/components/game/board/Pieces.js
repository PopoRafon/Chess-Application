import { useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { useGame } from '../../../contexts/GameContext';
import { useUsers } from '../../../contexts/UsersContext';
import { useGameSocket } from '../../../contexts/GameSocketContext';
import calcPosition from '../../../helpers/CalculatePosition';
import Piece from './Piece';

export default function Pieces({ rowsRef, colsRef, setPromotionMenu }) {
    const { game } = useGame();
    const { users } = useUsers();
    const { gameSocket } = useGameSocket();
    const [highlightedSquare, setHighlightedSquare] = useState({ show: false, row: 0, col: 0 });
    const piecesRef = useRef();
    const board = useMemo(() => users.player.color === 'w' ? game.board : game.board.map(row => row.slice().reverse()).reverse(), [game.board, users.player.color]);

    function handleDrop(event) {
        const [type, oldRow, oldCol] = event.dataTransfer.getData('text').split(',');
        const [newRow, newCol] = calcPosition(piecesRef, event);
        const move = colsRef.current[oldCol] + rowsRef.current[oldRow] + colsRef.current[newCol] + rowsRef.current[newRow];
        setPromotionMenu({ show: false });

        if (type[0] === game.turn && type[0] === users.player.color) {
            if (type[1] === 'p' && +oldRow === 1) {
                setPromotionMenu({
                    show: true,
                    newPos: [newRow, newCol],
                    move: move
                });
            } else {
                try {
                    new Chess(game.fen).move({ from: move.slice(0, 2), to: move.slice(2, 4) });

                    gameSocket.send(JSON.stringify({
                        type: 'move',
                        move: move
                    }));
                } catch {
                    return;
                }
            }
        }
    }

    return (
        <div
            ref={piecesRef}
            className="pieces"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
        >
            {highlightedSquare.show && <div className={`highlighted-square p-${highlightedSquare.row}${highlightedSquare.col}`}></div>}
            {board.map((row, rowIdx) => (
                row.map((piece, colIdx) => (
                    piece && (
                        <Piece
                            type={`${piece.color}${piece.type}`}
                            row={rowIdx}
                            col={colIdx}
                            piecesRef={piecesRef}
                            setHighlightedSquare={setHighlightedSquare}
                            key={`${rowIdx}${colIdx}`}
                        />
                    )
                ))
            ))}
        </div>
    );
}
