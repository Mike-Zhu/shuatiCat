import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text ,RichText} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'

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
        console.log('vakue => ', dataset)
        this.setState({
            answer: value
        })
    }

    render() {
        let { detail, options } = this.props.detail
        let { analysis } = detail
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
                        <View className={`option ${this.state.answer === option.key ? 'error' : ''}`}
                            key={option.key}
                            onClick={this.choice}
                            data-value={option.key}
                        >
                            <Text className="tag" data-value={option.key}>{option.key}</Text>
                            <Text className="value" data-value={option.key}>{option.value}</Text>
                        </View>
                    ))}
                </View>
                <Text className="tags">
                    Answer Analysis
                </Text>
                <Text className="analysis">
                    {analysis.replace(/<\/br>/g,'\n')}
                </Text>
                <Text className="tags">
                    Content Incorrect
                </Text>
            </View>
        )
    }

    setDetail(number) {
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
        this.props.dispatch({
            type: "initDetail",
            payload: {
                detail,
                options
            }
        })
        // console.log('detail => ', detail)
    }

    getNewQuestion(number) {
        let beDone = Object.keys(this.info)
        let newQuesList = this.bank.filter(ques => {
            let number = ques.question_number
            return beDone.indexOf(number) < 0
        })
        return newQuesList[0]
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