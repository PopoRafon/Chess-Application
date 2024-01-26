import { createContext, useState, useContext } from 'react';

const initialValue = {
    isLoggedIn: false,
    avatar: '',
    email: '',
    username: '',
    rating: null
};

const UserContext = createContext(initialValue);

function UserProvider({ children }) {
    const [user, setUser] = useState(initialValue);

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

export { UserProvider, useUser, UserContext };
