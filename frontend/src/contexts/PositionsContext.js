import { createContext, useState, useContext } from 'react';

const PositionsContext = createContext();

function initialSetup() {
    return [
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ];
}

function PositionsProvider({ children }) {
    const [positions, setPositions] = useState(initialSetup());

    return (
        <PositionsContext.Provider value={{positions, setPositions}}>
            {children}
        </PositionsContext.Provider>
    );
}

function usePositions() {
    const context = useContext(PositionsContext);

    return context;
}

export { PositionsProvider, usePositions };
