
const INITIAL_STATE = {
    secondType: []
}

export default function select(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'setSecondType':
            return {
                ...state,
                secondType: action.payload
            }
        default:
            return state
    }
}
