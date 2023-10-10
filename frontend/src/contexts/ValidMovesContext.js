import { createContext, useState, useContext } from 'react';

const ValidMovesContext = createContext();

function ValidMovesProvider({ children }) {
    const [validMoves, setValidMoves] = useState([]);

    return (
        <ValidMovesContext.Provider value={{ validMoves, setValidMoves }}>
            {children}
        </ValidMovesContext.Provider>
    );
}

function useValidMoves() {
    const context = useContext(ValidMovesContext);

    return context;
}

export { ValidMovesProvider, useValidMoves };
