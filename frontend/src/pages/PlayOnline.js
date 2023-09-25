import Navigation from '../components/Navigation';
import Sidebar from '../components/PlayOnlineSidebar';
import Game from '../components/Game';

function PlayOnline() {
    return (
        <>
            <Navigation />
            <div className="play-page">
                <Game
                    isDisabled={false}
                    />
                <Sidebar
                    messages={[]}
                    moves={[]}
                    />
            </div>
        </>
    );
}

export default PlayOnline;
