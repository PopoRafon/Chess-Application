import { useContext, createContext, useState } from 'react';

const GameSocketContext = createContext();

function GameSocketProvider({ children }) {
    const [gameSocket, setGameSocket] = useState();

    return (
        <GameSocketContext.Provider value={{ gameSocket, setGameSocket }}>
            {children}
        </GameSocketContext.Provider>
    );
}

function useGameSocket() {
    const context = useContext(GameSocketContext);

    return context;
}

export { GameSocketProvider, useGameSocket };
