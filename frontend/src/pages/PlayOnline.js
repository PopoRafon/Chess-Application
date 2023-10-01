import Sidebar from '../components/sidebars/PlayOnlineSidebar';
import Game from '../components/game/Game';

function PlayOnline() {
    return (
        <div className="play-page">
            <Game
                isDisabled={false}
            />
            <Sidebar
                messages={[]}
                moves={[]}
            />
        </div>
    );
}

export default PlayOnline;
