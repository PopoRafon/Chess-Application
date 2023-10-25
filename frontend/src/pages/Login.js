import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import LoginForm from '../components/forms/LoginForm';
import Navigation from '../components/sidebars/Navigation';

export default function Login({ isLoaded }) {
    const { user } = useUser();
    const navigate = useNavigate();

    if (user.isLoggedIn) {
        navigate('/');
    }

    return isLoaded && (
        <>
            <Navigation />
            <div className="form-page">
                <div className="form-container">
                    <LoginForm />
                </div>
            </div>
        </>
    );
}
