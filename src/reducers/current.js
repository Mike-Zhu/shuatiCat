
const INITIAL_STATE = {
    paper_id: '',//paper_id
    index: 0,//刷到第几题了
}

export default function current(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'setPaperId':
            return {
                ...state,
                paper_id: action.payload
            }
        case 'setPaperIndex':
            return {
                ...state,
                index: action.payload
            }
        case 'setClientInfo':
            return {
                state,
                clientInfo: action.payload
            }
        default:
            return state
    }
}
