
const INITIAL_STATE = {
    detail: '',//detail
    options: [],//options
}

export default function current(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'initDetail':
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
