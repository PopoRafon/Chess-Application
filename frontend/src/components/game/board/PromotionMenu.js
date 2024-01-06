import { useUsers } from '../../../contexts/UsersContext';
import { useGameSocket } from '../../../contexts/GameSocketContext';

export default function PromotionMenu({ promotionMenu, setPromotionMenu }) {
    const { users } = useUsers();
    const { gameSocket } = useGameSocket();
    const { oldPos: [oldRow, oldCol], newPos: [newRow, newCol] } = promotionMenu;

    function handleExit() {
        setPromotionMenu({ show: false });
    }

    function handlePromote(piecePromotionType) {
        gameSocket.send(JSON.stringify({
            type: 'move',
            move: 'abcdefgh'[oldCol] + '87654321'[oldRow] + 'abcdefgh'[newCol] + '87654321'[newRow] + piecePromotionType
        }));

        setPromotionMenu({ show: false });
    }

    return (
        <div
            className="promotion-menu"
            style={{marginTop: `calc(-25px + ${newRow * 90}px)`, marginLeft: `calc(-70px + ${newCol * 90}px)`}}
        >
            {['q', 'r', 'b', 'n'].map((type) => (
                <button
                    key={type}
                    className={`promotion-${type}-field promotion-field-${users.player.color}`}
                    onClick={() => handlePromote(type)}
                >
                    <div className={`promotion-${type}-piece ${users.player.color}${type}`}></div>
                </button>
            ))}
            <button
                className="promotion-exit-button"
                onClick={handleExit}
            />
        </div>
    );
}
