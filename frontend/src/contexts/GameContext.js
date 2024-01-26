import { createContext, useReducer, useContext } from 'react';
import gameReducer from '#reducers/GameReducer';

const initialValue = {
    fen: '',
    result: '',
    pgn: [],
    history: [],
    board: [],
    turn: ''
};

const GameContext = createContext(initialValue);

function GameProvider({ children }) {
    const [game, dispatchGame] = useReducer(gameReducer, initialValue);

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

export { GameProvider, useGame, GameContext };
