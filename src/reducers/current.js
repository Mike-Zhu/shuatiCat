
const INITIAL_STATE = {
    user_id: '',//user_id
    token: '',//token
    paper_id: '',//paper_id
    index: 0,//刷到第几题了
}

export default function current(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'setLoginInfo':
            return {
                ...state,
                user_id: action.payload.user_id,
                token: action.payload.token
            }
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
