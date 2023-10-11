export default function pointsReducer(state, action) {
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
        [action.turn]: state[action.turn] + pointsToAdd
    };
}