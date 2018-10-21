import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, RichText, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import gourpPng from '../../icons/group.png'
import icSend from '../../icons/ic_send.png'
import buttonPng from '../../icons/button.png'

@connect(({ detail }) => {
    return {
        detail
    }
}, (dispatch) => ({

}))

export default class Detail extends Component {
    constructor(props) {
        super(props)
        this.detail = this.detail || {}
    }

    componentDidShow() {
        let paperId = Taro.getStorageSync('paperId')
        if (this.paperId !== paperId) {
            this.initData()
            this.paperId = Taro.getStorageSync('paperId')
        }
        this.setDetail(24)
    }

    choice(e) {
        let dataset = e.target.dataset
        let value = dataset.value
        let {
            dispatch,
            detail: { detail: answer, isCompleted, isMulty, answerList }
        } = this.props
        if (isCompleted) return
        if (isMulty) {
            let answerIndex = answerList.indexOf(value)
            if (answerIndex >= 0) {
                answerList.splice(answerIndex, 1)
            } else {
                answerList.push(value)
            }
            let newArray = [].concat(answerList)
            dispatch({
                type: "setMultyAnwser",
                payload: newArray
            })
            dispatch({
                type: 'setPending',
                payload: true
            })
        }

        if (!isMulty) {
            dispatch({
                type: 'setAnwser',
                payload: value
            })
            dispatch({
                type: 'setCompletd'
            })
        }
    }

    enterMulty() {
        let { dispatch, detail } = this.props
        let isRight = this.isMultyAnswerRight()
        dispatch({
            type: 'setCompletd'
        })
        dispatch({
            type: 'setPending',
            payload: false
        })
    }

    isMultyAnswerRight() {
        let { answerList, detail: { answer: trueAnswer } } = this.props.detail
        let trueAnswerSrting = trueAnswer.split().sort().join()
        let answer = answerList.sort().join()
        return trueAnswerSrting === answer
    }
    getOptionClassName(key, answerList) {
        let {
            isMulty,
            detail: { answer: trueAnswer },
            answer,
            isCompleted
        } = this.props.detail
        let name = "option"

        if (!isMulty) {
            let noAnswer = !answer
            let isRight = answer === trueAnswer
            let isChoiced = key === answer
            let answerName = isRight ? `${name} success` : `${name} error`
            if (!isChoiced || noAnswer) return name
            return answerName
        }
        if (isMulty) {
            let isChoiced = answerList.indexOf(key) >= 0
            let isRight = this.isMultyAnswerRight()
            let answerName = isRight ? `${name} success` : `${name} error`
            let pendingName = `${name} pending`
            if (!isChoiced) return name
            if (isChoiced && !isCompleted) return pendingName
            if (isChoiced && isCompleted) return answerName
        }
    }

    render() {
        let { detail, options, isCompleted, answer, answerList, isPending } = this.props.detail
        let { analysis } = detail
        let domList = getQuestionRender(detail.question)
        return (
            <View className="detail">
                <View className="question">
                    {domList.map(res => {
                        switch(res.type){
                            case "Text":
                                return  <Text>{res.value}</Text> 
                        }
                    })}
                </View>
                <View className="tags">
                    Options
                    {isPending && answerList.length > 0 && <Button onClick={this.enterMulty}>确定</Button>}
                </View>
                <View className="options">
                    {options.map(option => (
                        <View className={this.getOptionClassName(option.key, answerList)}
                            key={option.key}
                            onClick={this.choice}
                            data-value={option.key}
                        >
                            <Text className="tag" data-value={option.key}>{option.key}</Text>
                            <Text className="value" data-value={option.key}>{option.value}</Text>
                        </View>
                    ))}
                </View>
                {
                    isCompleted &&
                    <Text className="tags">
                        Answer Analysis
                    </Text>
                }
                {isCompleted && <Text className="analysis">
                    {analysis && analysis.replace(/<\/br>/g, '\n')}
                </Text>}
                {isCompleted && <Text className="tags">
                    Content Incorrect
                </Text>}
                {isCompleted && <View className="feedback">
                    <Image src={gourpPng} className="group"></Image>
                    <input placeholder="Send Feedback"></input>
                    <Image src={icSend} className="icsend"></Image>
                </View>}
                {isCompleted &&
                    <View onClick={this.refresh} className="next">
                        <Image src={buttonPng} ></Image>
                    </View>
                }
            </View>
        )
    }

    refresh() {
        this.setDetail(parseInt(Math.random() * 50))
    }
    setDetail(number) {
        console.log('题号为 ： ', number)
        let detail = this.getNewQuestion(number)
        Taro.setNavigationBarTitle({
            title: detail.category
        })
        let options = [];
        ['A', 'B', 'C', 'D'].forEach(letter => {
            let comLetter = `option_${letter}`
            let value = detail[comLetter]
            value && options.push({
                key: letter,
                value
            })
        })
        let isMulty = detail.subject === '多选'
        this.props.dispatch({
            type: "initDetail",
            payload: {
                detail,
                options,
                isMulty,
                answer: undefined,
                answerList: [],
                isCompleted: false
            }
        })
        // console.log('detail => ', detail)
    }

    getNewQuestion(number) {
        let beDone = Object.keys(this.info)
        let newQuesList = this.bank.filter(ques => {
            let innerNumber = ques.question_number
            return beDone.indexOf(innerNumber) < 0
        })
        return number ? newQuesList[number] : newQuesList[0]
    }

    initData() {
        let questionBank = Taro.getStorageSync('questionBank')
        let questionInfo = Taro.getStorageSync('questionInfo')
        let paperId = Taro.getStorageSync('paperId')
        if (!paperId) {
            console.log('没有存储当前题库')
            return
        }
        let bank = questionBank
            ? JSON.parse(questionBank)
            : []
        let info = questionInfo
            ? JSON.parse(questionInfo)
            : {}
        this.bank = bank
        this.info = info[paperId] || {}
    }

    config = {
        "backgroundTextStyle": "light",
        "navigationBarBackgroundColor": "#FF6961",
        "navigationBarTitleText": "标题",
        "navigationBarTextStyle": "#fff",
    }
}


function getQuestionRender (str) {
    let vdomList = []
    vdomList.push({
        type:"Text",
        value:str
    })
    return vdomList
}