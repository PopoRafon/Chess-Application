import { useState } from 'react';
import { useGameSocket } from '#contexts/GameSocketContext';
import { useUser } from '#contexts/UserContext';

export default function Chat({ gameType, messages }) {
    const [showSubmitTooltip, setShowSubmitTooltip] = useState(false);
    const [showErrorTooltip, setShowErrorTooltip] = useState(false);
    const [messageData, setMessageData] = useState('');
    const { gameSocket } = useGameSocket();
    const { user } = useUser();

    function handleChange(event) {
        const { value, scrollHeight, style: { height } } = event.target;
        const inputHeight = scrollHeight - parseInt(height);

        if (value.length > 255) {
            setShowErrorTooltip(true);
        } else {
            setShowErrorTooltip(false);
            setMessageData(value);
        }

        if (inputHeight > 10) {
            event.target.style.height = '36px';
        } else {
            event.target.style.height = '21px';
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.target.style.height = '21px';

            sendMessage();
        }
    }

    function sendMessage() {
        gameSocket.send(JSON.stringify({
            type: 'message',
            body: messageData
        }));

        setMessageData('');
        setShowErrorTooltip(false);
    }

    return (
        <div className="chat">
            {gameType === 'ranking' && (                
                <div className="chat-container">
                    <div className="chat-header">Chat</div>
                    <ul className="chat-messages scrollbar">
                        {messages.slice().reverse().map((message, index) => (
                            <li key={index}>
                                <span
                                    style={{ color: user.username === message.username ? 'green' : 'red' }}
                                >
                                    {message.username}
                                </span>
                                <span>: {message.body}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="chat-footer">
                        <textarea
                            className="chat-footer-input"
                            placeholder="Send message..."
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            maxLength="256"
                            rows="1"
                            value={messageData}
                        />
                        {showErrorTooltip && (<span className="chat-error-tooltip">Message cannot be longer than 255 characters!</span>)}
                        <button
                            type="submit"
                            onMouseEnter={() => setShowSubmitTooltip(true)}
                            onMouseLeave={() => setShowSubmitTooltip(false)}
                            onClick={sendMessage}
                            className="chat-footer-submit"
                        >
                            {showSubmitTooltip && <span className="tooltip">Send</span>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
