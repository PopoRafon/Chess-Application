import HomeRanking from '#components/home/HomeRanking';
import HomeContainer from '#components/home/HomeContainer';

export default function Home() {
    return (
        <main className="home-page">
            <HomeRanking />
            <HomeContainer />
        </main>
    );
}
