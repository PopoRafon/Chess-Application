import { useEffect, useState, useRef } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useUsers } from '../../../contexts/UsersContext';
import { useSurrenderMenu } from '../../../contexts/SurrenderMenuContext';
import SurrenderMenu from '../extra/SurrenderMenu';
import GameResultAlert from '../extra/GameResultAlert';
import Arbiter from './Arbiter';

function SideLetters({ lettersType, letters }) {
    const { users } = useUsers();
    const indexShift = useRef(users.player.color === 'b' ? 1 : 0);
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

function Square({ colIdx, rowIdx }) {
    const { users } = useUsers();

    if (users.player.color === 'b') colIdx++;

    return <div className={(colIdx + rowIdx) % 2 === 0 ? 'white-square' : 'black-square'}></div>;
}

export default function ChessBoard({ disableBoard, setDisableBoard, gameType }) {
    const [showResultAlert, setShowResultAlert] = useState(false);
    const { surrenderMenu } = useSurrenderMenu();
    const { users } = useUsers();
    const { game } = useGame();
    const rows = [8, 7, 6, 5, 4, 3, 2, 1];
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    useEffect(() => {
        if (game.result) {
            setShowResultAlert(true);
            setDisableBoard(true);
        }
    }, [game.result, setDisableBoard]);

    return (
        <div className="chess-board">
            {disableBoard && <div className="disable-board"></div>}
            {showResultAlert && (
                <GameResultAlert
                    setShowResultAlert={setShowResultAlert}
                    gameType={gameType}
                />
            )}
            {surrenderMenu && (
                <SurrenderMenu />
            )}
            <div className="board-squares">
                {rows.map((_, rowIdx) => (
                    cols.map((_, colIdx) => (
                        <Square
                            rowIdx={rowIdx}
                            colIdx={colIdx}
                            key={`${rowIdx}${colIdx}`}
                        />   
                    ))
                ))}
            </div>
            <Arbiter />
            <SideLetters
                letters={users.player.color === 'w' ? rows : rows.reverse()}
                lettersType="rows"
            />
            <SideLetters
                letters={users.player.color === 'w' ? cols : cols.reverse()}
                lettersType="cols"
            />
        </div>
    );
}
