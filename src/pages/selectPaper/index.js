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
        // add() {
        //     dispatch(add())
        // },
    })
)
export default class SelectType extends Component {
    constructor(props) {
        super(props)
    }

    api = {
        getTitleByProvince: "api/getTitleByProvince"
    }
    config = {
        "backgroundTextStyle": "light",
        "navigationBarBackgroundColor": "#FF6961",
        "navigationBarTitleText": this.$router.params.type,
        "navigationBarTextStyle": "#fff",
    }
    async componentDidMount() {
        let { type } = this.$router.params
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
    routeGo() {
        let dataset = e.target.dataset || {}
        console.log(dataset)
        // let value = dataset.value || {}
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
                        {content.title}
                        <Button onClick={this.routeGo} data-id={content.id}>SELECT</Button>
                    </View>
                ))}
            </View>
        )
    }
}

