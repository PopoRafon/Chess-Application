import { useGameSocket } from '../../../contexts/GameSocketContext';
import { useSurrenderMenu } from '../../../contexts/SurrenderMenuContext';

export default function SurrenderMenu() {
    const { gameSocket } = useGameSocket();
    const { setSurrenderMenu } = useSurrenderMenu();

    function handleSurrender() {
        gameSocket.send(JSON.stringify({
            type: 'surrender'
        }));

        setSurrenderMenu(false);
    }

    return (
        <div className="surrender-menu">
            <div>
                <span>Do you want to surrender?</span>
            </div>
            <div className="surrender-buttons-container">
                <button
                    className="surrender-yes-button"
                    onClick={handleSurrender}
                >
                    YES
                </button>
                <button
                    className="surrender-no-button"
                    onClick={() => setSurrenderMenu(false)}
                >
                    NO
                </button>
            </div>
        </div>
    );
}
