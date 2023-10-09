import { useUser } from '../../contexts/UserContext';

export default function GameSidebar() {
    const { user } = useUser();

    return (
        <div className="game-sidebar">
            <img
                src='/static/images/avatar.png'
                className="game-user-avatar"
                alt="Avatar"
            />
            <div className="game-information">
                {user.isLoggedIn ? (
                    <div>
                        <span>{user.username}</span>
                        <span className="game-user-rating">(800)</span>
                    </div>

                ) : (
                    <span>Guest</span>
                )}
                <div className="game-points"></div>
            </div>
            <div className="game-timer">10:00</div>
        </div>
    );
}
