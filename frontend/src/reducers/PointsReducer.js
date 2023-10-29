export default function pointsReducer(state, action) {
    if (action.type) {
        const playerColor = action.type[0] === 'w' ? 'b' : 'w';
        let pointsToAdd;

        switch (action.type[1]) {
            case 'p':
                pointsToAdd = 1;
                break; 
            case 'n':
                pointsToAdd = 3;
                break;
            case 'b':
                pointsToAdd = 3;
                break;
            case 'r':
                pointsToAdd = 5;
                break;
            case 'q':
                pointsToAdd = 9;
                break;
            default:
                throw new Error();
        }
    
        return {
            ...state,
            [playerColor]: state[playerColor] + pointsToAdd
        };
    }

    return state;
}
