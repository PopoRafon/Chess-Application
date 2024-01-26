import { useNavigate } from 'react-router-dom';
import { useUser } from '#contexts/UserContext';
import RegisterForm from '#components/forms/RegisterForm';

export default function Register() {
    const { user } = useUser();
    const navigate = useNavigate();

    if (user.isLoggedIn) {
        navigate('/');
    }

    return !user.isLoggedIn && (
        <div className="form-page">
            <div className="form-container">
                <RegisterForm />
            </div>
        </div>
    );
}
