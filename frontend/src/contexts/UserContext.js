import { createContext, useState, useContext } from 'react';

const UserContext = createContext();

function UserProvider({ children }) {
    const [user, setUser] = useState({isLoggedIn: false});

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

function useUser() {
    const context = useContext(UserContext);

    return context;
}

export { UserProvider, useUser };
