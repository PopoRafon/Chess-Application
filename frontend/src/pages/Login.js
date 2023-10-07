import LoginForm from '../components/forms/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function Login({ setAlert }) {
    const { user } = useUser();
    const navigate = useNavigate();

    if (user.isLoggedIn) {
        navigate('/');
    }

    return (
        <div className="form-page">
            <div className="form-container">
                <LoginForm setAlert={setAlert} />
            </div>
        </div>
    );
}