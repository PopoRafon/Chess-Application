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
    const attackedSquares = useRef({ w: [], b: [] });
    const kingCheckSquares = useRef({ w: [], b: [] });
    const piecesRef = useRef();

    useEffect(() => {
        attackedSquares.current = { w: [], b: [] };
        kingCheckSquares.current = { w: [], b: [] };

        for (const [rowIdx, row] of game.positions.entries()) {
            for (const [colIdx, piece] of row.entries()) {
                if (!piece) continue;
                const viableMoves = getViableMoves(game, piece, attackedSquares, rowIdx, colIdx, kingCheckSquares, true);
                const oppositePlayerColor = piece[0] === 'w' ? 'b' : 'w';
                let newAttackedSquares = [];

                for (let [moveIdx, move] of viableMoves.entries()) {
                    const position = game.positions[move[0]][move[1]];

                    newAttackedSquares.push(`${move[0]}${move[1]}`);

                    if (position[1] === 'k' && position[0] === oppositePlayerColor) {
                        let newKingCheckSquares = [`${rowIdx}${colIdx}`];

                        if (piece[1] === 'r' || piece[1] === 'b' || piece[1] === 'q') {
                            if (Math.abs(Number(move[0]) - Number(rowIdx)) > 1 || Math.abs(Number(move[1]) - Number(colIdx)) > 1) {
                                while (true) {
                                    moveIdx--;
    
                                    newKingCheckSquares.push(viableMoves[moveIdx]);
    
                                    if (Math.abs(Number(viableMoves[moveIdx][0]) - Number(rowIdx)) <= 1 && Math.abs(Number(viableMoves[moveIdx][1]) - Number(colIdx)) <= 1) {
                                        break;
                                    }
                                }
                            }
                        }

                        kingCheckSquares.current = {
                            ...kingCheckSquares.current,
                            [oppositePlayerColor]: [
                                ...kingCheckSquares.current[oppositePlayerColor],
                                [...newKingCheckSquares]
                            ]
                        };
                    }
                }

                attackedSquares.current = {
                    ...attackedSquares.current,
                    [oppositePlayerColor]: [
                        ...attackedSquares.current[oppositePlayerColor],
                        ...newAttackedSquares
                    ]
                };
            }
        }
    }, [game, game.turn]);

    const handleDragOver = (event) => event.preventDefault();

    function handleDrop(event) {
        const [piece, oldRow, oldCol] = event.dataTransfer.getData('text').split(',');
        const { row, col } = calcPosition(piecesRef.current, event);

        setPromotionMenu({ show: false });

        if (validateMove(game, piece, attackedSquares, oldRow, oldCol, row, col, kingCheckSquares)) {
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
                            kingCheckSquares={kingCheckSquares}
                            key={i + '-' + j}
                        />
                    ))
                ))
            ))}
        </div>
    );
}
