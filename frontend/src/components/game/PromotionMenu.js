export default function PromotionMenu({ promotionMenu, setPromotionMenu }) {
    const { data, newPositions, position, setPositions, turn, setTurn } = promotionMenu;
    const [row, col] = position;

    function handleExit() {
        setPromotionMenu({show: false});
    }

    function handlePromote(type) {
        newPositions[data[1]][data[2]] = '';
        newPositions[row][col] = data[0][0] + type;

        setPositions(newPositions);
        turn === 'w' ? setTurn('b') : setTurn('w');
        setPromotionMenu({show: false});
    }

    return (
        <div
            className="promotion-menu"
            style={{
                top: `${((row - 1) * 90 + 25) + (window.innerHeight * 0.11)}px`,
                left: `${((col - 1) * 90 + 25) + (window.innerWidth * 0.27)}px`
            }}
        >
            {['q', 'r', 'b', 'n'].map((type) => (
                <button
                    key={type}
                    className={`promotion-${type}-field promotion-field-${turn}`}
                    onClick={() => handlePromote(`${type}`)}
                    >
                    <div className={`promotion-${type}-piece ${turn}${type}`}></div>
                </button>
            ))}
            <button
                className="promotion-exit-button"
                onClick={handleExit}
            />
        </div>
    );
}
