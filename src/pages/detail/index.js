import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, RichText, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import gourpPng from '../../icons/group.png'
import icSend from '../../icons/ic_send.png'
import buttonPng from '../../icons/button.png'
import * as OptionController from '../../service/detailController'
import { getJSON } from "../../service/utils"
import { post } from "../../service/http"
import Alert from "../../components/alert"

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
        this.user_id = Taro.getStorageSync('user_id')

    }
    api = {
        getUpdateInfoCache: "api/getUpdateInfoCache"
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
            this.enterTheAnswer()
        }
    }

    enterTheAnswer() {
        let { detail: { answerList, answer, isMulty, detail: finalDetail } } = this.props
        let { answer: trueAnswer } = finalDetail
        let finalAnswer = isMulty ? answerList.join(' ') : answer
        let isCorrect = finalAnswer === trueAnswer
        let { getUpdateInfoCache } = this.api
        this.updateInfo(isCorrect, finalAnswer, finalDetail)
        let params = this.getParams(isCorrect, finalAnswer)
        post(getUpdateInfoCache, params)
    }
    updateInfo(isCorrect, finalAnswer, finalDetail) {
        let { id, question_number } = finalDetail
        let { info, user_id } = this
        let cache = info[question_number] || {}
        let timeScamp = new Date().getTime()
        let correct = cache.correct || 0
        let wrong = cache.wrong || 0
        let record = getJSON(cache["record"], [])
        let appearTime = record.length
        let score = Math.max(1, 7 - appearTime)
        let primary_key = `${user_id}_${id}`
        let newRecord = {
            time: timeScamp,
            isRight: isCorrect,
            select: finalAnswer
        }
        let weighted = cache.weighted ? Number(cache.weighted) : 0

        weighted = isCorrect ? weighted + score : weighted
        record.push(newRecord)
        isCorrect ? correct++ : wrong++

        cache = {
            ...cache,
            correct,
            firstDateTime: cache.firstDateTime || timeScamp,
            lastDateTime: timeScamp,
            paper_id: Taro.getStorageSync('paperId'),
            primary_key,
            question_id: id,
            question_number,
            record: JSON.stringify(record),
            user_id: user_id,
            weighted,
            wrong
        }
        info[question_number] = cache
        Taro.setStorageSync('questionInfo', JSON.stringify(info))
    }

    getParams(isCorrect) {
        let { detail: { detail: finalDetail } } = this.props
        let { id, question_number } = finalDetail
        let { info, user_id } = this
        let cache = info[question_number]

        let {
            lastDateTime,
            firstDateTime,
            record,
            paper_id
        } = cache
        let appearTime = Math.max(getJSON(record, []).length - 1, 0)
        let score = Math.max(1, 7 - appearTime)

        let params = {
            user_id,
            paper_id,
            question_id: id,
            record: record,
            question_number,
            correct: isCorrect ? 1 : 0,
            wrong: isCorrect ? 0 : 1,
            weighted: isCorrect ? score : 0,
            lastDateTime,
            firstDateTime
        }
        return params
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
        this.enterTheAnswer()
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
        let { analysis, question_material, question } = detail
        let { clientInfo } = this.props

        question = replaceBR(question)
        analysis = replaceBR(analysis)

        let domList = getQuestionRender(question, clientInfo)
        options.forEach(result => { result.domList = getQuestionRender(result.value, clientInfo) })
        let analysisDomList = getQuestionRender(analysis, clientInfo)

        let materialList = question_material ? getQuestionRender(question_material, clientInfo) : []
        let noMaterialStyle = {
            height: (clientInfo.screenHeight - 100) / 2 + 'px',
            borderBottom:'1px solid #dbdbdb'
        }
        return (
            <View className="detail">
                <LoginStatus isLoggedIn={true} />
                {question_material &&
                    <View className="tags">
                        材料分析
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
                {
                    question_material &&
                    <View className="tags">
                        题目内容
                    </View>
                }
                <View className="question" style = {!question_material && noMaterialStyle}>
                    {domList.map(res => {
                        return res.type === "Text"
                            ? <Text key={res.key}>{res.value}</Text>
                            : res.type === "Image" ? <Image style={res.style} key={res.key} src={res.url} />
                                : <Image key={res.key} src={res.url} />
                    })}
                </View>
                <View className="tags">
                    选项
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
                        答案分析
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
                    内容有误？
                </Text>}
                {isCompleted && <View className="feedback">
                    <Image src={gourpPng} className="group"></Image>
                    <Text>报告错误内容</Text>
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
        this.setDetail()
    }
    setDetail(number) {
        // console.log('题号为 ： ', number)
        let { detail: { isNewQuestion } } = this.props
        let detail = isNewQuestion ? this.getNewQuestion(number) : this.getErrorQuestion(number)
        //没有返回说明题已经刷完,回到主页
        if (!detail) {
            console.log("题已刷完!")
            Taro.navigateBack()
            return
        }
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
    }

    getNewQuestion(number = 0) {
        let info = this.info, bank = this.bank
        let filterList = OptionController.getNewIndexList(info, bank)

        let finalQuestionList = bank.filter(ques => filterList.indexOf(ques.question_number) >= 0)
        return finalQuestionList[number]
    }

    prevNumber
    getErrorQuestion(number = 0) {
        let info = this.info, bank = this.bank
        let filterList = OptionController.getErrorIndexList(info)

        let preIndex = filterList.indexOf(this.prevNumber)
        let couldBeFixed = preIndex >= 0 && filterList.length > 1
        if (couldBeFixed) filterList.splice(preIndex, 1)

        let length = filterList.length
        number = parseInt(Math.random() * length, 10)

        let finalQuestionList = bank.filter(ques => filterList.indexOf(ques.question_number) >= 0)
        let errorQues = finalQuestionList[number]
        this.prevNumber = errorQues && errorQues.question_number
        return errorQues
    }

    initData() {
        let questionBank = Taro.getStorageSync('questionBank')
        let questionInfo = Taro.getStorageSync('questionInfo')
        let paperId = Taro.getStorageSync('paperId')
        if (!paperId) {
            console.log('没有存储当前题库')
            return
        }
        let bank = getJSON(questionBank, [])
        let info = getJSON(questionInfo)
        this.bank = bank
        this.info = info
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

function replaceBR(str) {
    if (!str) return str
    return str.replace(/<\/br>/g, '\n').replace(/<br \/>/g, '\n')
}