import { useState, useRef } from 'react';

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
    ]
}

function calcPosition(ref, event) {
    const {width, x, y} = ref.current.getBoundingClientRect();
    const squareSize = width / 8;
    const row = Math.floor((event.clientY - y) / squareSize);
    const col = Math.floor((event.clientX - x) / squareSize);

    return {row, col};
}

function Piece({ type, row, col }) {
    const [pos, setPos] = useState();

    function handleDragStart(event) {
        const {left, top} = event.target.getBoundingClientRect();
        
        event.dataTransfer.setDragImage(event.target, window.outerWidth, window.outerHeight);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', [type, row, col]);
        event.target.style = 'z-index: 10;';

        setPos([left, top]);
    }

    function handleDrag(event) {
        event.target.style.left = `${event.clientX-pos[0]-45}px`;
        event.target.style.top = `${event.clientY-pos[1]-45}px`;
    }

    function handleDragEnd(event) {
        event.target.removeAttribute('style');
    }

    return (
        <div
            draggable={true}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className={`piece ${type} p-${row}${col}`}
            >
        </div>
    );
}

function Pieces() {
    const [positions, setPositions] = useState(initialPositionsSetup());
    const ref = useRef();
    
    const handleDragOver = (event) => event.preventDefault();

    function handleDrop(event) {
        const data = event.dataTransfer.getData('text').split(',');
        const newPositions = positions.slice();
        const {row, col} = calcPosition(ref, event);

        newPositions[data[1]][data[2]] = '';
        newPositions[row][col] = data[0];

        setPositions(newPositions);
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

export default Pieces;
