import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import http, { user_id } from '../../service/http'
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
        let dataset = e.target.dataset || {}
        let paperId = dataset.id
        let { api: { getPaper, getQuestionInfoByPaperid } } = this
        let paper = await http.get(getPaper, {
            user_id,
            paperId
        })
        let questionInfo = await http.get(getQuestionInfoByPaperid, {
            user_id,
            paper_id: paperId
        })
        Taro.setStorageSync('paperId', paperId)
        Taro.setStorageSync('questionBank', JSON.stringify(paper.data))
        Taro.setStorageSync('questionInfo', JSON.stringify(questionInfo.data))
        // Taro.navigateTo({
        //     url: `/pages/selectType/index?type=${value}`
        // })
    }
    render() {
        let { select: { paperList } } = this.props
        return (
            <View className="select">
                {paperList.map(content => (
                    <View class="content" key={content.id}>
                        <Text>{content.title}</Text>
                        <Button onClick={this.download} data-id={content.id}>SELECT</Button>
                    </View>
                ))}
            </View>
        )
    }
}
