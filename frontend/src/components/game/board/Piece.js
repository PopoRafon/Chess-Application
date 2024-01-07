import { useState } from 'react';
import { useUsers } from '../../../contexts/UsersContext';

export default function Piece({ type, row, col }) {
    const [pos, setPos] = useState();
    const { users } = useUsers();

    function handlePieceDragStart(event) {
        if (users.player.color !== type[0]) return event.preventDefault();
        const { left, top } = event.target.getBoundingClientRect();

        event.dataTransfer.setDragImage(event.target, window.outerWidth, window.outerHeight);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', [type, row, col]);
        event.target.style = 'z-index: 10;';

        setPos([left, top]);
    }

    function handlePieceDrag(event) {
        event.target.style.left = `${event.clientX-pos[0]-45}px`;
        event.target.style.top = `${event.clientY-pos[1]-45}px`;
    }

    function handlePieceDragEnd(event) {
        event.target.removeAttribute('style');
    }

    return (
        <div
            draggable={true}
            onDragStart={handlePieceDragStart}
            onDrag={handlePieceDrag}
            onDragEnd={handlePieceDragEnd}
            className={`piece ${type} p-${row}${col}`}
        >
        </div>
    );
}
