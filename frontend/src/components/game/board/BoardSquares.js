import { useRef } from 'react';
import { useUsers } from '../../../contexts/UsersContext';

export default function BoardSquares({ rowsRef, colsRef }) {
    const { users } = useUsers();
    const indexShift = useRef(users.player.color === 'w' ? 0 : 1);

    return (
        <div className="board-squares">
            {rowsRef.current.map((_, rowIdx) => (
                colsRef.current.map((_, colIdx) => (
                    <div
                        className={(colIdx + rowIdx + indexShift.current) % 2 === 0 ? 'white-square' : 'black-square'}
                        key={`${rowIdx}${colIdx}`}
                    >
                    </div>
                ))
            ))}
        </div>
    );
}
