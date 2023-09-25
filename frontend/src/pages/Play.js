import Navigation from '../components/Navigation';
import Sidebar  from '../components/PlaySidebar';
import Game from '../components/Game';

function Play() {
    return (
        <>
            <Navigation />
            <div className="play-page">
                <Game isDisabled={true} />
                <Sidebar />
            </div>
        </>
    );
}

export default Play;
