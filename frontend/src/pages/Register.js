import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import RegisterForm from '../components/forms/RegisterForm';
import Navigation from '../components/core/Navigation';

export default function Register({ isLoaded }) {
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
                    <RegisterForm />
                </div>
            </div>
        </>
    );
}
