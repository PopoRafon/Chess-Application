import { useState } from 'react';

export default function Chat({ messages }) {
    const [messageInput, setMessageInput] = useState('');
    const [submitTooltip, setSubmitTooltip] = useState(false);

    function handleChange(event) {
        const { value } = event.target;

        setMessageInput(value);
    }

    return (
        <div className="chat">
            <div className="chat-container">
                <div className="chat-header">Chat</div>
                <ul className="chat-messages scrollbar">
                    {messages.map((message, index) => (
                        <li key={index}>Username: {message}</li>
                    ))}
                </ul>
                <div className="chat-footer">
                    <input
                        type="text"
                        name="message"
                        placeholder="Send message..."
                        value={messageInput}
                        onChange={handleChange}
                        className="chat-footer-input"
                    />
                    <button
                        type="submit"
                        onMouseEnter={() => setSubmitTooltip(true)}
                        onMouseLeave={() => setSubmitTooltip(false)}
                        className="chat-footer-submit"
                    >
                        {submitTooltip && <span className="tooltip">Send</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}
