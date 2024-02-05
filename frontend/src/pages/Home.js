import TopPlayersRanking from '#components/ranking/TopPlayersRanking';
import HomeContainer from '#components/home/HomeContainer';

export default function Home() {
    return (
        <main className="home-page">
            <TopPlayersRanking />
            <HomeContainer />
        </main>
    );
}
