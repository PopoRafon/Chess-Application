import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function Register() {
    const { user } = useUser();
    const navigate = useNavigate();

    if (user.isLoggedIn) {
        navigate('/');
    }

    return (
        <div className="form-page">
            <div className="form-container">
                <RegisterForm />
            </div>
        </div>
    );
}

export default Register;
