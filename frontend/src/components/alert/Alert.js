import { useEffect } from 'react';
import { useAlert } from '#contexts/AlertContext';

export default function Alert() {
    const { alert, setAlert } = useAlert();

    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                setAlert('');
            }, 3500);
        }
    });

    return alert && (
        <div className="alert">
            <div className="alert-box">
                <img
                    src="/static/images/icons/alert_icon.png"
                    className="alert-icon"
                    alt="Alert"
                />
                {alert}
            </div>
        </div>
    );
}
