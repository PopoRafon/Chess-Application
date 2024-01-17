import { useRef, useMemo } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useGameSocket } from '../../../contexts/GameSocketContext';
import { useUsers } from '../../../contexts/UsersContext';
import { Chess } from 'chess.js';
import calcPosition from '../../../helpers/CalculatePosition';
import Piece from './Piece';

export default function Pieces({ setPromotionMenu }) {
    const { game } = useGame();
    const { gameSocket } = useGameSocket();
    const { users } = useUsers();
    const piecesRef = useRef();
    const board = useMemo(() => users.player.color === 'w' ? game.board : game.board.map(row => row.slice().reverse()).reverse(), [game.board, users.player.color]);

    function handleDrop(event) {
        const [type, oldRow, oldCol] = event.dataTransfer.getData('text').split(',');
        const [newRow, newCol] = calcPosition(piecesRef.current, event);
        setPromotionMenu({ show: false });
        let move;

        if (users.player.color === 'w') {
            move = 'abcdefgh'[oldCol] + '87654321'[oldRow] + 'abcdefgh'[newCol] + '87654321'[newRow];
        } else {
            move = 'hgfedcba'[oldCol] + '12345678'[oldRow] + 'hgfedcba'[newCol] + '12345678'[newRow];
        }

        try {
            new Chess(game.fen).move({ from: move.slice(0, 2), to: move.slice(2, 4) })

            if (type[0] === game.turn) {
                if (type[1] === 'p' && (newRow === 7 || newRow === 0)) {
                    setPromotionMenu({
                        show: true,
                        oldPos: [oldRow, oldCol],
                        newPos: [newRow, newCol],
                    });
                } else {
                    gameSocket.send(JSON.stringify({
                        type: 'move',
                        move: move
                    }));
                }
            }
        } catch {
            return;
        }
    }

    return (
        <div
            ref={piecesRef}
            className="pieces"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
        >
            {board.map((row, rowIdx) => (
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
