
const INITIAL_STATE = {
    detail: '',//detail
    options: [],//options
    isMulty: false,//是否多选
    isCompleted: false,//是否完成状态
    answer: undefined,
    answerList: [],//多选时候的选项库

}

export default function current(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'initDetail':
            return {
                ...state,
                ...action.payload,
            }
        case 'setCompletd':
            return {
                ...state,
                isCompleted: true,
            }
        case 'setNotCompletd':
            return {
                ...state,
                isCompleted: false,
            }
        case 'setPending':
            return {
                ...state,
                isPending: action.payload,
            }
        case 'setMultyAnwser':
            return {
                ...state,
                answerList: action.payload
            }
        case 'setAnwser':
            return {
                ...state,
                answer: action.payload
            }
        default:
            return state
    }
}
