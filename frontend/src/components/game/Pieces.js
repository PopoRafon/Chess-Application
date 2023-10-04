import { useState, useRef } from 'react';
import Piece from './Piece';
import validate_move from './Moves';

function initialPositionsSetup() {
    return [
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ];
}

function calcPosition(ref, event) {
    const { width, x, y } = ref.current.getBoundingClientRect();
    const squareSize = width / 8;
    const row = Math.floor((event.clientY - y) / squareSize);
    const col = Math.floor((event.clientX - x) / squareSize);

    return { row, col };
}

export default function Pieces({ setPromotionMenu }) {
    const [positions, setPositions] = useState(initialPositionsSetup());
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
                    setPositions: setPositions,
                    turn: turn,
                    setTurn: setTurn
                });

                return;
            }

            newPositions[data[1]][data[2]] = '';
            newPositions[row][col] = data[0];

            setPositions(newPositions);
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
