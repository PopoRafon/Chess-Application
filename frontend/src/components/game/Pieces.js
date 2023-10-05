import { useState, useRef } from 'react';
import Piece from './Piece';
import validate_move from './Moves';
import { usePrevMoves } from '../../contexts/PreviousMovesContext';
import { usePositions } from '../../contexts/PositionsContext';

function calcPosition(ref, event) {
    const { width, x, y } = ref.current.getBoundingClientRect();
    const squareSize = width / 8;
    const row = Math.floor((event.clientY - y) / squareSize);
    const col = Math.floor((event.clientX - x) / squareSize);

    return { row, col };
}

export default function Pieces({ setPromotionMenu }) {
    const { positions, setPositions } = usePositions();
    const { prevMoves, setPrevMoves } = usePrevMoves();
    const [turn, setTurn] = useState('w');
    const ref = useRef();

    const handleDragOver = (event) => event.preventDefault();

    function handleDrop(event) {
        const data = event.dataTransfer.getData('text').split(',');
        const newPositions = positions.slice();
        const { row, col } = calcPosition(ref, event);

        setPromotionMenu({show: false});

        if (validate_move(data, row, col, turn, positions)) {
            if ((data[0] === 'wp' && row === 0) || (data[0] === 'bp' && row === 7)) {
                setPromotionMenu({
                    show: true,
                    data: data,
                    newPositions: newPositions,
                    position: [row, col],
                    turn: turn,
                    setTurn: setTurn
                });

                return;
            }

            const capturedPiece = newPositions[row][col];
            const square = 'abcdefgh'[col] + '87654321'[row];
            let move;

            if (capturedPiece) {
                move = 'abcdefgh'[data[2]] + 'x' + square;
            } else {
                move = data[0][1] === 'p' ? square : data[0][1].toUpperCase() + square;
            }

            newPositions[data[1]][data[2]] = '';
            newPositions[row][col] = data[0];

            setPositions(newPositions);
            
            setPrevMoves([
                ...prevMoves,
                [move, newPositions.map(row => row.slice())]
            ]);

            turn === 'w' ? setTurn('b') : setTurn('w');
        }
    }

    return (
        <div
            ref={ref}
            className="pieces"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {positions.map((row, i) => (
                row.map((col, j) => (
                    (positions[i][j] && (
                        <Piece
                            type={positions[i][j]}
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
