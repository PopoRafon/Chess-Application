import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import LoginForm from '../components/forms/LoginForm';
import Navigation from '../components/core/Navigation';

export default function Login() {
    const { user } = useUser();
    const navigate = useNavigate();

    if (user.isLoggedIn) {
        navigate('/');
    }

    return !user.isLoggedIn && (
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
