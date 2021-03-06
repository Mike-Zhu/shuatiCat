import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import http from '../../service/http'
import './index.scss'


@connect(
    ({ counter, select }) => ({
        counter,
        select
    }),
    (dispatch) => ({

    })
)
export default class SelectType extends Component {
    constructor(props) {
        super(props)
    }

    api = {
        getPaper: "api/getPaper",
        getTitleByProvince: "api/getTitleByProvince",
        getQuestionInfoByPaperid: "api/getQuestionInfoByPaperid"
    }
    config = {
        "backgroundTextStyle": "light",
        "navigationBarBackgroundColor": "#FF6961",
        "navigationBarTitleText": 'Default',
        "navigationBarTextStyle": "#fff",
    }
    async componentDidMount() {
        let { type } = this.$router.params
        let user_id = Taro.getStorageSync('user_id')
        Taro.setNavigationBarTitle({
            title: type
        })
        let { api: { getTitleByProvince } } = this
        let paperList = await http.get(getTitleByProvince, {
            province: type,
            user_id
        })
        this.props.dispatch({
            type: 'setPaperList',
            payload: paperList.data
        })
    }
    async download(e) {
        let user_id = Taro.getStorageSync('user_id')
        let dataset = e.target.dataset || {}
        let paperId = dataset.id,
            paperName = dataset.name
        let { api: { getPaper, getQuestionInfoByPaperid } } = this
        Taro.showLoading({
            title:"下载中,请稍候"
        })
        let questionInfo = await http.get(getQuestionInfoByPaperid, {
            user_id,
            paper_id: paperId
        })
        let paper = await http.get(getPaper, {
            user_id,
            paperId
        })
        let info = questionInfo && questionInfo.data && questionInfo.data[paperId]
        info = info && {}
        Taro.setStorageSync('paperId', paperId)
        Taro.setStorageSync('paperName', paperName)
        Taro.setStorageSync('questionBank', JSON.stringify(paper.data))
        Taro.setStorageSync('questionInfo', JSON.stringify(info))
        Taro.hideLoading()
        Taro.redirectTo({
            url: `/pages/index/index`
        })
    }
    render() {
        let { select: { paperList } } = this.props
        paperList = paperList.sort((left,right) => {
            let leftTitle = left.title && left.title.slice(0,4)
            let rightTitle = right.title && right.title.slice(0,4)
            return Number(rightTitle) - Number(leftTitle)
        })
        return (
            <View className="select">
                {paperList.map(content => (
                    <View class="content" key={content.id}>
                        <Text>{content.title}</Text>
                        <Button
                            onClick={this.download}
                            data-id={content.id}
                            data-name={content.title}
                        >选择</Button>
                    </View>
                ))}
            </View>
        )
    }
}

