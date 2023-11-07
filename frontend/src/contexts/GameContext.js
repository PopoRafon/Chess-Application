import { createContext, useReducer, useContext } from 'react';
import gameReducer from '../reducers/GameReducer';

const GameContext = createContext();

function GameProvider({ children }) {
    const [game, dispatchGame] = useReducer(gameReducer, { prevMoves: [], markedSquares: [] });

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
