import { useRef, memo } from 'react';
import { useUsers } from '#contexts/UsersContext';

const BoardCoordinates = memo(function BoardCoordinates({ coordinatesType, coordinates }) {
    const { users } = useUsers();
    const indexShift = useRef(users.player.color === 'w' ? 0 : 1);
    const coordinatesColors = useRef(coordinatesType === 'cols' ? ['white-letter', 'black-letter'] : ['black-letter', 'white-letter']);

    return (
        <div
            className={`board-${coordinatesType}`}
            draggable={false}
        >
            {coordinates.map((col, index) => (
                <span
                    className={(index + indexShift.current) % 2 === 0 ? coordinatesColors.current[0] : coordinatesColors.current[1]}
                    key={index}
                >
                    {col}
                </span>
            ))}
        </div>
    );
});

export default BoardCoordinates;
