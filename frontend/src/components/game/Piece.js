import { useState } from 'react';

function Piece({ type, row, col }) {
    const [pos, setPos] = useState();

    function handleDragStart(event) {
        const { left, top } = event.target.getBoundingClientRect();
        
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

export default Piece;
