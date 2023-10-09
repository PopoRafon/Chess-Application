import { useContext, createContext, useReducer } from 'react';
import pointsReducer from '../reducers/PointsReducer';

const PointsContext = createContext();

function PointsProvider({ children }) {
    const [points, dispatchPoints] = useReducer(pointsReducer, { w: 0, b: 0 });

    return (
        <PointsContext.Provider value={{points, dispatchPoints}}>
            {children}
        </PointsContext.Provider>
    );
}

function usePoints() {
    const context = useContext(PointsContext);

    return context;
}

export { PointsProvider, usePoints };
