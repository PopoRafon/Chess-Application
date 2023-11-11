import { useState } from 'react';
import { useUser } from '../../../contexts/UserContext';

export default function Chat({ socket, messages }) {
    const [submitTooltip, setSubmitTooltip] = useState(false);
    const [errorTooltip, setErrorTooltip] = useState(false);
    const [messageData, setMessageData] = useState('');
    const { user } = useUser();

    function handleChange(event) {
        const { value, scrollHeight, style: { height } } = event.target;
        const inputHeight = scrollHeight - parseInt(height);

        if (value.length > 255) {
            setErrorTooltip(true);
        } else {
            setErrorTooltip(false);
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
        socket.send(JSON.stringify({
            type: 'message',
            body: messageData
        }));

        setMessageData('');
        setErrorTooltip(false);
    }

    return (
        <div className="chat">
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
                    {errorTooltip && (<span className="chat-error-tooltip">Message cannot be longer than 255 characters!</span>)}
                    <button
                        type="submit"
                        onMouseEnter={() => setSubmitTooltip(true)}
                        onMouseLeave={() => setSubmitTooltip(false)}
                        onClick={sendMessage}
                        className="chat-footer-submit"
                    >
                        {submitTooltip && <span className="tooltip">Send</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}
