import Navigation from '../components/core/Navigation';
import RankingTable from '../components/ranking/RankingTable';

export default function Ranking(isLoaded) {
    return isLoaded && (
        <>
            <Navigation />
            <RankingTable />
        </>
    );
}
