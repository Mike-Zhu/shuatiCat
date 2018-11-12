import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'
import http from '../../service/http'
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
export default class College extends Component {
    api = {
        getSecondType: "api/getSecondType"
    }
    config = {
        "backgroundTextStyle": "light",
        "navigationBarBackgroundColor": "#FF6961",
        "navigationBarTitleText": "选择题库",
        "navigationBarTextStyle": "#fff",
    }
    async componentDidMount() {
        let { getSecondType } = this.api
        let user_id = Taro.getStorageSync('user_id')
        let secondType = await http.get(getSecondType, {
            user_id
        })
        let { data } = secondType
        this.props.dispatch({
            type: 'setSecondType',
            payload: data
        })
    }
    routeGo(e) {
        let dataset = e.target.dataset || {}
        let value = dataset.value || {}
        let { secondType } = value
        Taro.navigateTo({
            url: `/pages/selectType/index?secondType=${secondType}`
        })
    }
    render() {
        let { select: { secondType } } = this.props
        return (
            <View className="select">
                {secondType.map(second => (
                    <View key={second.type} className="down-title">
                        <View className="title">{second.type}</View>
                        <View>
                            {second.content.map(content => (
                                <View class="content" key={content.secondType}>
                                    <Text>{content.secondType}</Text>
                                    <Button onClick={this.routeGo} data-value={content}>选择</Button>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        )
    }
}

