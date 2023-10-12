import Navigation from '../components/sidebars/Navigation';

export default function Home({ isLoaded }) {
    return isLoaded && (
        <>
            <Navigation />
            <div>
            </div>
        </>
    );
}
