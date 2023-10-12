import { useAlert } from '../contexts/AlertContext';
import { useEffect } from 'react';

export default function Alert() {
    const { alert, setAlert } = useAlert();

    useEffect(() => {
        setTimeout(() => {
            setAlert({ show: false, message: '' });
        }, 3500);
    }, [setAlert, alert.show]);

    return alert.show && (
        <div className="alert">
            <div className="alert-box">
                <img
                    src="/static/images/icons/alert_icon.png"
                    className="alert-icon"
                    alt="Alert"
                />
                {alert.message}
            </div>
        </div>
    );
}
