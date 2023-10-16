import { useRef, useEffect } from 'react';
import Piece from './Piece';
import { validateMove, getViableMoves } from './Moves';
import { useGame } from '../../contexts/GameContext';
import calcPosition from '../../helpers/CalculatePosition';
import { useValidMoves } from '../../contexts/ValidMovesContext';
import { usePoints } from '../../contexts/PointsContext';
import playSound from './Sounds';

export default function Pieces({ setPromotionMenu }) {
    const { game, dispatchGame } = useGame();
    const { validMoves, setValidMoves } = useValidMoves();
    const { dispatchPoints } = usePoints();
    const kingCheck = useRef({ w: false, b: false });
    const attackedSquares = useRef({ w: [], b: [] });
    const piecesRef = useRef();

    useEffect(() => {
        kingCheck.current = { w: false, b: false };
        attackedSquares.current = { w: [], b: [] };

        for (const [i, row] of game.positions.entries()) {
            for (const [j, piece] of row.entries()) {
                if (!piece) continue;
                const viableMoves = getViableMoves(game, piece, attackedSquares, i, j, kingCheck, true);

                for (const move of viableMoves) {
                    const position = game.positions[move[0]][move[1]];
                    const oppositePlayerColor = piece[0] === 'w' ? 'b' : 'w';

                    attackedSquares.current = {
                        ...attackedSquares.current,
                        [oppositePlayerColor]: [
                            ...attackedSquares.current[oppositePlayerColor],
                            `${move[0]}${move[1]}`
                        ]
                    };

                    if (position[1] === 'k' && position[0] === oppositePlayerColor) {
                        kingCheck.current = {
                            ...kingCheck.current,
                            [oppositePlayerColor]: true
                        };
                    }
                }
            }
        }
    }, [game, game.turn]);

    const handleDragOver = (event) => event.preventDefault();

    function handleDrop(event) {
        const [piece, oldRow, oldCol] = event.dataTransfer.getData('text').split(',');
        const { row, col } = calcPosition(piecesRef.current, event);

        setPromotionMenu({ show: false });

        if (validateMove(game, piece, attackedSquares, oldRow, oldCol, row, col, kingCheck)) {
            if ((piece === 'wp' && row === 0) || (piece === 'bp' && row === 7)) {
                return setPromotionMenu({
                    show: true,
                    data: [piece, oldRow, oldCol],
                    position: [row, col],
                });
            }

            const newPositions = game.positions.slice();
            const capturedPiece = newPositions[row][col];
            const square = 'abcdefgh'[col] + '87654321'[row];
            const markedSquares = [`${oldRow}${oldCol}`, `${row}${col}`];
            let move = (piece[1] === 'p' ? (capturedPiece && 'abcdefgh'[oldCol]) : piece[1].toUpperCase()) + (capturedPiece && 'x') + square;
            let newCastlingDirections = '';

            if (piece[1] === 'k') {
                const side = piece[0] === 'w' ? 7 : 0;
                const direction = col - oldCol;

                if (Math.abs(direction) === 2) {
                    const rookPos = direction === 2 ? 7 : 0;
                    const newRookPos = direction === 2 ? 5 : 3;

                    newPositions[side][newRookPos] = newPositions[side][rookPos];
                    newPositions[side][rookPos] = '';

                    move = direction === 2 ? 'O-O' : 'O-O-O';
                }

                if (game.castlingDirections[piece] !== 'none') {
                    newCastlingDirections = piece[0] === 'w' ? { wk: 'none' } : { bk: 'none' };
                }
            } else if (piece[1] === 'r' && game.castlingDirections[piece[0] + 'k'] !== 'none') {
                if (col === 0 && game.castlingDirections[piece[0] + 'k'] !== 'left') {
                    newCastlingDirections = piece[0] === 'w' ? { wk: 'right' } : { bk: 'right' };
                } else if (col === 7 && game.castlingDirections[piece[0] + 'k'] !== 'right') {
                    newCastlingDirections = piece[0] === 'w' ? { wk: 'left' } : { bk: 'left' };
                }
            }

            if (capturedPiece) {
                dispatchPoints({ 
                    type: capturedPiece,
                    turn: game.turn
                });
            }

            newPositions[oldRow][oldCol] = '';
            newPositions[row][col] = piece;

            playSound(move, capturedPiece);

            setValidMoves([]);

            dispatchGame({
                type: 'NEXT_ROUND',
                positions: newPositions,
                prevMove: [
                    move,
                    newPositions.map(row => row.slice()),
                    markedSquares
                ],
                markedSquares: markedSquares,
                castlingDirections: newCastlingDirections
            });
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
            {game.positions.map((row, i) => (
                row.map((_, j) => (
                    (game.positions[i][j] && (
                        <Piece
                            type={game.positions[i][j]}
                            row={i}
                            col={j}
                            attackedSquares={attackedSquares}
                            kingCheck={kingCheck}
                            key={i + '-' + j}
                        />
                    ))
                ))
            ))}
        </div>
    );
}
