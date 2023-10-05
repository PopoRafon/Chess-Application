import { createContext, useState, useContext } from 'react';

const PrevMovesContext = createContext();

function PrevMovesProvider({ children }) {
    const [prevMoves, setPrevMoves] = useState([]);

    return (
        <PrevMovesContext.Provider value={{prevMoves, setPrevMoves}}>
            {children}
        </PrevMovesContext.Provider>
    );
}

function usePrevMoves() {
    const context = useContext(PrevMovesContext);

    return context;
}

export { usePrevMoves, PrevMovesProvider };
