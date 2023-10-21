import { useState } from 'react';
import { useValidMoves } from '../../contexts/ValidMovesContext';

export default function Piece({ type, row, col, availableMoves }) {
    const [pos, setPos] = useState();
    const { setValidMoves } = useValidMoves();
    const position = `${row}${col}`;

    function handleClick() {
        const moves = availableMoves.current[type[0]][position];

        setValidMoves(moves);
    }

    function handleDragStart(event) {
        const moves = availableMoves.current[type[0]][position];
        const { left, top } = event.target.getBoundingClientRect();

        event.dataTransfer.setDragImage(event.target, window.outerWidth, window.outerHeight);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', [type, row, col]);
        event.target.style = 'z-index: 10;';

        setValidMoves(moves);
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
            onClick={handleClick}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className={`piece ${type} p-${row}${col}`}
        >
        </div>
    );
}
