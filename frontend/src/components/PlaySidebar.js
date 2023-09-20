import { Link } from 'react-router-dom';

function SidebarLink({ key, gameType }) {
    return (
        <li>
            <Link to={gameType.href} key={key} className="sidebar-play-button">
                <span className="sidebar-play-button-title">{gameType.title}</span>
                <span className="sidebar-play-button-content">{gameType.content}</span>
            </Link>
        </li>
    );
}

function Sidebar() {
    const gameTypes = [
        {
            key: 1,
            title: 'Play Online',
            href: '/play/online',
            content: 'Play online with other players'
        },
        {
            key: 2,
            title: 'Computer',
            href: '/play/computer',
            content: 'Play with computer'
        },
        {
            key: 3,
            title: 'Play with Friend',
            href: '/play/friend',
            content: 'Invite your friend to the game'
        }
    ]

    return (
        <div className="game-sidebar">
            <ul style={{width: '100%'}}>
                {gameTypes.map((type) => (
                    <SidebarLink key={type.key} gameType={type} />
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
