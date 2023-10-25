import { useContext, createContext, useState } from 'react';

const UsersContext = createContext();

function UsersProvider({ children }) {
    const [users, setUsers] = useState();

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

export { UsersProvider, useUsers };
