import { createContext, useReducer, useContext } from 'react';
import gameReducer from '../reducers/GameReducer';
import setup from '../helpers/InitialPositionsSetup';

const GameContext = createContext();

function GameProvider({ children }) {
    const [game, dispatchGame] = useReducer(gameReducer, {
        positions: setup(),
        prevMoves: [],
        markedSquares: [],
        turn: 'w'
    });

    return (
        <GameContext.Provider value={{game, dispatchGame}}>
            {children}
        </GameContext.Provider>
    );
}

function useGame() {
    const context = useContext(GameContext);

    return context;
}

export { GameProvider, useGame };
