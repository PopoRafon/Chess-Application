import { useGame } from '../../../contexts/GameContext';
import { useValidMoves } from '../../../contexts/ValidMovesContext';
import { usePromotionMenu } from '../../../contexts/PromotionMenuContext';
import { useGameSocket } from '../../../contexts/GameSocketContext';
import { useUsers } from '../../../contexts/UsersContext';

export default function PromotionMenu() {
    const { game } = useGame();
    const { setValidMoves } = useValidMoves();
    const { gameSocket } = useGameSocket();
    const { promotionMenu, setPromotionMenu } = usePromotionMenu();
    const { data: [oldRow, oldCol], position: [newRow, newCol] } = promotionMenu;
    const { users } = useUsers();

    function handleExit() {
        setPromotionMenu({ show: false });
    }

    function handlePromote(piecePromotionType) {
        const isPlayerWhite = users.player.color === 'w';
        const lines = isPlayerWhite ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];

        gameSocket.send(JSON.stringify({
            type: 'promotion',
            promotionType: piecePromotionType,
            oldPos: [lines[oldRow], lines[oldCol]],
            newPos: [lines[newRow], lines[newCol]]
        }));

        setValidMoves([]);

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
                    className={`promotion-${type}-field promotion-field-${game.turn}`}
                    onClick={() => handlePromote(type)}
                    >
                    <div className={`promotion-${type}-piece ${game.turn}${type}`}></div>
                </button>
            ))}
            <button
                className="promotion-exit-button"
                onClick={handleExit}
            />
        </div>
    );
}
