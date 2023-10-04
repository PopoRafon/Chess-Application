import Sidebar  from '../components/sidebars/PlaySidebar';
import Game from '../components/game/Game';

export default function Play() {
    return (
        <div className="play-page">
            <Game isDisabled={true} />
            <Sidebar />
        </div>
    );
}
