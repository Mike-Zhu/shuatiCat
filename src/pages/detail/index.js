import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, RichText, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import gourpPng from '../../icons/group.png'
import icSend from '../../icons/ic_send.png'
import buttonPng from '../../icons/button.png'

@connect(({ detail }) => ({
    detail
}), (dispatch) => ({

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
        this.setDetail()
    }

    choice(e) {
        let dataset = e.target.dataset
        let value = dataset.value
        let {
            dispatch,
            isMulty,
            detail: { detail: answer ,isCompleted}
        } = this.props
        if (isMulty) {
            choiceMulty(value)
            return
        }
        console.log(isCompleted)
        if(isCompleted) return
        dispatch({
            type: 'setAnwser',
            payload: value
        })
        dispatch({
            type: 'setCompletd'
        })
    }

    enterMulty() {
        let { answerList } = this.detail.detail

    }

    choiceMulty(value) {
        let { answerList } = this.detail.detail
        answerList.push(value)
        this.props.dispatch({
            type: "setMultyAnwser",
            payload: answerList
        })

    }

    getOptionClassName(key) {
        let {
            isMulty,
            detail: { answer: trueAnser },
            answer,
            answerList
        } = this.props.detail
        let name = "option"
        if (!isMulty) {
            if (answer) {
                let isRight = answer === trueAnser
                let answerName = isRight ? `${name} success` : `${name} error`
                name = key === answer ? answerName : name
            }
            console.log('name => ', name)
            console.log('key => ', key)
            return name
        }

    }


    render() {
        let { detail, options, isCompleted, answer, answerList } = this.props.detail
        let { analysis } = detail
        // console.log(isCompleted)
        return (
            <View className="detail">
                <View className="question">
                    {detail.question}
                    {detail.question}
                    {detail.question}
                </View>
                <Text className="tags">
                    Options
                </Text>
                <View className="options">
                    {options.map(option => (
                        <View className={this.getOptionClassName(option.key)}
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
        console.log('refresh')
        console.log(number)
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