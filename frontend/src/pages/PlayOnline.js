import Sidebar from '../components/PlayOnlineSidebar';
import Game from '../components/Game';

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
