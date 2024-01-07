import { useRef } from 'react';
import { useUsers } from '../../../contexts/UsersContext';

export default function BoardSideLetters({ lettersType, letters }) {
    const { users } = useUsers();
    const indexShift = useRef(users.player.color === 'w' ? 0 : 1);
    const letterColors = useRef(lettersType === 'cols' ? ['white-letter', 'black-letter'] : ['black-letter', 'white-letter']);

    return (
        <div className={`board-${lettersType}`}>
            {letters.map((col, index) => (
                <span
                    className={(index + indexShift.current) % 2 === 0 ? letterColors.current[0] : letterColors.current[1]}
                    key={index}
                >
                    {col}
                </span>
            ))}
        </div>
    );
}
