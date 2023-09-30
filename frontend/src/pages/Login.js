import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function Login() {
    const { user } = useUser();
    const navigate = useNavigate();

    if (user.isLoggedIn) {
        navigate('/');
    }

    return (
        <div className="form-page">
            <div className="form-container">
                <LoginForm />
            </div>
        </div>
    );
}

export default Login;
