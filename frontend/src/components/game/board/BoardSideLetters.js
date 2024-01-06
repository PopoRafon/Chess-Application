import { useRef } from 'react';

export default function BoardSideLetters({ lettersType, letters }) {
    const letterColors = useRef(lettersType === 'cols' ? ['white-letter', 'black-letter'] : ['black-letter', 'white-letter']);

    return (
        <div className={`board-${lettersType}`}>
            {letters.map((col, index) => (
                <span
                    className={index % 2 === 0 ? letterColors.current[0] : letterColors.current[1]}
                    key={index}
                >
                    {col}
                </span>
            ))}
        </div>
    );
}
