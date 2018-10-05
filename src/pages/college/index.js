import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'
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
export default class College extends Component {
    api = {
        getSecondType: "api/getSecondType"
    }
    config = {
        navigationBarTitleText: 'Select Subject'
    }
    async componentDidMount() {
        let { getSecondType } = this.api
        let secondType = await http.get(getSecondType, {
            user_id
        })
        let { data } = secondType
        this.props.dispatch({
            type: 'setSecondType',
            payload: data
        })
    }
    routeGo(){
        
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
                                    {content.secondType}
                                    <Button onClick={this.routeGo} data-value="college">SELECT</Button>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        )
    }
}

