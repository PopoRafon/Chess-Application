import Sidebar  from '../components/sidebars/PlaySidebar';
import Game from '../components/game/Game';

function Play() {
    return (
        <div className="play-page">
            <Game isDisabled={true} />
            <Sidebar />
        </div>
    );
}

export default Play;
