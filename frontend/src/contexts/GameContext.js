import { createContext, useReducer, useContext } from 'react';
import gameReducer from '../reducers/GameReducer';
import initGameState from '../helpers/InitGameState';

const GameContext = createContext();

function GameProvider({ children }) {
    const [game, dispatchGame] = useReducer(gameReducer, initGameState());

    return (
        <GameContext.Provider value={{ game, dispatchGame }}>
            {children}
        </GameContext.Provider>
    );
}

function useGame() {
    const context = useContext(GameContext);

    return context;
}

export { GameProvider, useGame };
