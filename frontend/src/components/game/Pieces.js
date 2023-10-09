import { useRef } from 'react';
import Piece from './Piece';
import { validateMove } from './Moves';
import { useGame } from '../../contexts/GameContext';
import calcPosition from '../../helpers/CalculatePosition';
import { useValidMoves } from '../../contexts/ValidMovesContext';

export default function Pieces({ setPromotionMenu }) {
    const { game, dispatchGame } = useGame();
    const { validMoves, setValidMoves } = useValidMoves();
    const ref = useRef();

    const handleDragOver = (event) => event.preventDefault();

    function handleDrop(event) {
        const data = event.dataTransfer.getData('text').split(',');
        const { row, col } = calcPosition(ref, event);

        setPromotionMenu({show: false});

        if (validateMove(game, data, row, col)) {
            if ((data[0] === 'wp' && row === 0) || (data[0] === 'bp' && row === 7)) {
                setPromotionMenu({
                    show: true,
                    data: data,
                    position: [row, col],
                });

                return;
            }

            const newPositions = game.positions.slice();
            const capturedPiece = newPositions[row][col];
            const square = 'abcdefgh'[col] + '87654321'[row];
            const markedSquares = [`${data[1]}${data[2]}`, `${row}${col}`];
            const side = data[0][0] === 'w' ? 7 : 0;
            let move = (data[0][1] === 'p' ? (capturedPiece ? 'abcdefgh'[data[2]] : '') : data[0][1].toUpperCase()) + (capturedPiece ? 'x' : '') + square;
            let newCastlingDirections = '';
            let audio;

            if (data[0][1] === 'k') {
                if (col - data[2] === -2) {
                    newPositions[side][3] = newPositions[side][0];
                    newPositions[side][0] = '';
                    move = 'O-O-O';
                    audio = new Audio('/static/sounds/castle.mp3');
                } else if (col - data[2] === 2) {
                    newPositions[side][5] = newPositions[side][7];
                    newPositions[side][7] = '';
                    move = 'O-O';
                    audio = new Audio('/static/sounds/castle.mp3');
                }
            }

            if (newPositions[row][col] && !audio) {
                audio = new Audio('/static/sounds/capture.mp3');
            } else if (!audio) {
                audio = new Audio('/static/sounds/move.mp3');
            }

            audio.play();

            newPositions[data[1]][data[2]] = '';
            newPositions[row][col] = data[0];

            if (data[0][1] === 'k' && game.castlingDirections[data[0]] !== 'none') {
                newCastlingDirections = data[0][0] === 'w' ? { wk: 'none' } : { bk: 'none' };
            } else if (data[0][1] === 'r' && game.castlingDirections[data[0][0] + 'k'] !== 'none') {
                if (col === 0 && game.castlingDirections[data[0][0] + 'k'] !== 'left') {
                    newCastlingDirections = data[0][0] === 'w' ? { wk: 'right' } : { bk: 'right' };
                } else if (col === 7 && game.castlingDirections[data[0][0] + 'k'] !== 'right') {
                    newCastlingDirections = data[0][0] === 'w' ? { wk: 'left' } : { bk: 'left' };
                }
            }

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
            ref={ref}
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
                            key={i + '-' + j}
                        />
                    ))
                ))
            ))}
        </div>
    );
}
