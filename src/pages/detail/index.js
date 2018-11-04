import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, RichText, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import gourpPng from '../../icons/group.png'
import icSend from '../../icons/ic_send.png'
import buttonPng from '../../icons/button.png'
import * as OptionController from '../../service/detailController'


@connect(({ detail, current }) => {
    return {
        detail,
        clientInfo: current.clientInfo //client信息
    }
})

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
        this.setDetail(13)
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
        let { analysis, question_material } = detail
        let domList = getQuestionRender(detail.question, this.props.clientInfo)
        options.forEach(result => {
            result.domList = getQuestionRender(result.value, this.props.clientInfo)
        })
        analysis = analysis && analysis.replace(/<\/br>/g, '\/n')
        let analysisDomList = getQuestionRender(analysis, this.props.clientInfo)
        let materialList = question_material ? getQuestionRender(question_material, this.props.clientInfo) : []
        
        return (
            <View className="detail">
                {question_material &&
                    <View className="tags">
                        Material
                    </View>
                }
                {
                    question_material &&
                    <View className="material">
                        {materialList.map(res => {
                            return res.type === "Text"
                                ? <Text key={res.key}>{res.value}</Text>
                                : res.type === "Image" ? <Image style={res.style} key={res.key} src={res.url} />
                                    : <Image key={res.key} src={res.url} />
                        })}
                    </View>
                }
                <View className="tags">
                    Question
                </View>
                <View className="question">
                    {domList.map(res => {
                        return res.type === "Text"
                            ? <Text key={res.key}>{res.value}</Text>
                            : res.type === "Image" ? <Image style={res.style} key={res.key} src={res.url} />
                                : <Image key={res.key} src={res.url} />
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
                            <View className="value" data-value={option.key}>
                                {
                                    option.domList.map(res => {
                                        return res.type === "Text"
                                            ? <Text key={res.key} data-value={option.key}>{res.value}</Text>
                                            : <Image style={res.style} key={res.key} data-value={option.key} src={res.url} />
                                    })
                                }
                            </View>
                        </View>
                    ))}
                </View>
                {
                    isCompleted &&
                    <Text className="tags">
                        Answer Analysis
                    </Text>
                }
                {isCompleted && <View className="analysis">
                    {
                        analysisDomList.map(res => {
                            return res.type === "Text"
                                ? <RichText key={res.key}>{res.value}</RichText>
                                : res.type === "Image" ? <Image style={res.style} key={res.key} src={res.url} />
                                    : <Image key={res.key} src={res.url} />
                        })
                    }
                </View>}
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


function getQuestionRender(content, clientInfo) {
    let regex = /<img/g
    if (!content) return getOnlyText('')
    let splitList = content.split(regex)
    let hasNoImage = splitList.length === 1 && content.indexOf('img') < 0
    if (hasNoImage) return getOnlyText(content)
    return getImageAndText(splitList, clientInfo)
}

function getOnlyText(content) {
    return [{
        type: "Text",
        value: content,
        key: content.slice(0, 3)
    }]
}

function getImageAndText(splitList, clientInfo) {
    //文字与图嵌套
    let optionArray = [],
        count = 0;
    splitList.forEach((result, index) => {
        if (result.indexOf('/>') >= 0) {
            let imgArr = result.split('/>')
            if (!!imgArr[1]) {
                optionArray[index] = imgArr
            } else {
                splitList[index] = imgArr[0]
            }
        }
    })
    optionArray.forEach((result, index) => {
        splitList.splice(index, 1 + count, ...result)
        count++
    })
    let vdomList = splitList.map((content, index) => {
        let isGifImage = content.search(/.\/(.*)gif/g) >= 0
        let isCommonImage = content.search(/.\/(.*)png/g) >= 0 || content.search(/.\/(.*)jpg/g) >= 0
        if (isGifImage) return getGifUrl(content)
        if (isCommonImage) return getImageUrl(content, clientInfo)
        return { type: "Text", value: content, key: content }
    })
    return vdomList
}

function getImageUrl(content, clientInfo) {
    let url = OptionController._handleImageURL(content)
    let styleObj = OptionController.getStyle(content)
    let attrObj = OptionController.getAttr(content)
    let expr = /\/(.*)_(.*)x(.*)_/;
    let size = url.match(expr)
    let scale = 0.9
    let width = clientInfo.screenWidth - 40
    let height = 200
    let isSizeArray = Array.isArray(size) && size.length > 0
    if (isSizeArray) {
        let styleFromCulti = OptionController.setStyle(attrObj, styleObj, size, scale, clientInfo)
        let newSize = OptionController.setStyleForAnalysis(styleFromCulti, clientInfo)
        width = newSize.width
        height = newSize.height
    }
    //当图片宽度小于屏幕的0.7倍，不可点击放大
    let shouldBeMaxed = width < (clientInfo.screenWidth * 0.7) ? true : false

    return {
        key: url,
        type: "Image",
        url,
        shouldBeMaxed,
        style: {
            width: `${width}px`,
            height: `${height}px`,
        }
    }
}

function getGifUrl(content) {
    var re2 = /\".*?\"/gm;
    let urlArray = re2.exec(content)
    let url = urlArray[0].replace(/\"/g, "")
    return {
        type: "gif",
        url,
        key: url
    }
}