import { useContext, createContext, useState } from 'react';

const UsersContext = createContext(null);

function UsersProvider({ children }) {
    const [users, setUsers] = useState(null);

    return (
        <UsersContext.Provider value={{ users, setUsers }}>
            {children}
        </UsersContext.Provider>
    );
}

function useUsers() {
    const context = useContext(UsersContext);

    return context;
}

export { UsersProvider, useUsers, UsersContext };
