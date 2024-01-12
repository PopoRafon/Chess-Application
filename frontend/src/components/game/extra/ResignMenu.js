import { useGameSocket } from '../../../contexts/GameSocketContext';

export default function ResignMenu({ setShowResignMenu }) {
    const { gameSocket } = useGameSocket();

    function handleResign() {
        gameSocket.send(JSON.stringify({
            type: 'resign'
        }));

        setShowResignMenu(false);
    }

    return (
        <div className="resign-menu">
            <div>
                <span>Do you want to resign?</span>
            </div>
            <div className="resign-buttons-container">
                <button
                    className="resign-yes-button"
                    onClick={handleResign}
                >
                    YES
                </button>
                <button
                    className="resign-no-button"
                    onClick={() => setShowResignMenu(false)}
                >
                    NO
                </button>
            </div>
        </div>
    );
}
