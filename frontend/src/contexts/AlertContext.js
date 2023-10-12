import { useState, useContext, createContext } from 'react';

const AlertContext = createContext();

function AlertProvider({ children }) {
    const [alert, setAlert] = useState({ show: false, message: '' });

    return (
        <AlertContext.Provider value={{ alert, setAlert }}>
            {children}
        </AlertContext.Provider>
    );
}

function useAlert() {
    const context = useContext(AlertContext);

    return context;
}

export { AlertProvider, useAlert };
