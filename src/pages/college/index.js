import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.scss'


@connect(
    ({ counter }) => ({
        counter
    }),
    (dispatch) => ({
        // add() {
        //     dispatch(add())
        // },
    })
)
export default class College extends Component {

    config = {
        navigationBarTitleText: 'Select Subject'
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props, nextProps)
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <View className='index'>

            </View>
        )
    }
}

