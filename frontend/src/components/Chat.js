function Chat({ messages }) {
    return (
        <div className="chat">
            <div className="chat-container">
                <div className="chat-header">Chat</div>
                <ul className="chat-messages">
                    {messages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))}
                </ul>
                <div className="chat-footer">
                    <input
                        type="text"
                        placeholder="Send message..."
                        className="chat-footer-input"
                        />
                    <input
                        type="submit"
                        value=""
                        className="chat-footer-submit"
                        />
                </div>
            </div>
        </div>
    );
}

export default Chat;
