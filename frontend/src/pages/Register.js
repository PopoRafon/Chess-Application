import RegisterForm from '../components/forms/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function Register({ setAlert }) {
    const { user } = useUser();
    const navigate = useNavigate();

    if (user.isLoggedIn) {
        navigate('/');
    }

    return (
        <div className="form-page">
            <div className="form-container">
                <RegisterForm setAlert={setAlert} />
            </div>
        </div>
    );
}
