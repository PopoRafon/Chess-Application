import Navigation from '../components/core/Navigation';

export default function Home({ isLoaded }) {
    return isLoaded && (
        <>
            <Navigation />
            <div>
            </div>
        </>
    );
}
