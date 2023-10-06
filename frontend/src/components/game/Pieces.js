import { useRef } from 'react';
import Piece from './Piece';
import validateMove from './Moves';
import { useGame } from '../../contexts/GameContext';
import calcPosition from '../../helpers/CalculatePosition';

export default function Pieces({ setPromotionMenu }) {
    const { game, dispatchGame } = useGame();
    const ref = useRef();

    const handleDragOver = (event) => event.preventDefault();

    function handleDrop(event) {
        const data = event.dataTransfer.getData('text').split(',');
        const { row, col } = calcPosition(ref, event);

        setPromotionMenu({show: false});

        if (validateMove(data, row, col, game.turn, game.positions)) {
            if ((data[0] === 'wp' && row === 0) || (data[0] === 'bp' && row === 7)) {
                setPromotionMenu({
                    show: true,
                    data: data,
                    position: [row, col]
                });

                return;
            }

            const newPositions = game.positions.slice();
            const capturedPiece = newPositions[row][col];
            const square = 'abcdefgh'[col] + '87654321'[row];
            const move = (data[0][1] === 'p' ? (capturedPiece ? 'abcdefgh'[data[2]] : '') : data[0][1].toUpperCase()) + (capturedPiece ? 'x' : '') + square;

            newPositions[data[1]][data[2]] = '';
            newPositions[row][col] = data[0];

            dispatchGame({
                type: 'NEXT_ROUND',
                positions: newPositions,
                prevMove: [move, newPositions.map(row => row.slice())]
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
            {game.positions.map((row, i) => (
                row.map((col, j) => (
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
