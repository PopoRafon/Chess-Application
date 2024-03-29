import { Link } from 'react-router-dom';

export default function Page404() {
    return (
        <main className="error-page">
            <div className="error-box">
                <div className="error-header">404</div>
                <div className="error-content">OOPS! PAGE NOT FOUND</div>
                <Link
                    to="/"
                    className="error-home-button"
                >
                    Back to the Home page
                </Link>
            </div>
        </main>
    );
}
