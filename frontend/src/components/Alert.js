function Alert({ setAlert, message }) {
    setTimeout(() => {
        setAlert({ show: false, message: '' });
    }, 3500);

    return (
        <div className="alert">
            <div className="alert-box">
                <img
                    src="/static/images/icons/alert_icon.png"
                    className="alert-icon"
                    alt="Alert"
                />
                {message}
            </div>
        </div>
    );
}

export default Alert;
