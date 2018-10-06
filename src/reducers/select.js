
const INITIAL_STATE = {
    secondType: [],//第一层
    minType:[],//第二层
}

export default function select(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'setSecondType':
            return {
                ...state,
                secondType: action.payload
            }
        case 'setMinType':
            return {
                ...state,
                minType:action.payload
            }
        default:
            return state
    }
}
