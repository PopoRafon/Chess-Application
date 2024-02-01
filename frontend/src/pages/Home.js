import HomeRanking from '#components/home/HomeRanking';
import HomeContainer from '#components/home/HomeContainer';

export default function Home() {
    return (
        <div className="home-page">
            <HomeRanking />
            <HomeContainer />
        </div>
    );
}
