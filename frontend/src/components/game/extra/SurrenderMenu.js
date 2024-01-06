import { useGameSocket } from '../../../contexts/GameSocketContext';

export default function SurrenderMenu({ setShowSurrenderMenu }) {
    const { gameSocket } = useGameSocket();

    function handleSurrender() {
        gameSocket.send(JSON.stringify({
            type: 'surrender'
        }));

        setShowSurrenderMenu(false);
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
                    onClick={() => setShowSurrenderMenu(false)}
                >
                    NO
                </button>
            </div>
        </div>
    );
}
