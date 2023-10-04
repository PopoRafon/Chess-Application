import Sidebar from '../components/sidebars/PlayOnlineSidebar';
import Game from '../components/game/Game';

export default function PlayOnline() {
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
