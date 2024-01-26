import { useContext, createContext, useState } from 'react';

const GameSocketContext = createContext(null);

function GameSocketProvider({ children }) {
    const [gameSocket, setGameSocket] = useState(null);

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

export { GameSocketProvider, useGameSocket, GameSocketContext };
