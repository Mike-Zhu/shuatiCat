import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.scss'


class Test extends Component {

    config = {
        navigationBarTitleText: '首页'
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
                <Button className='add_btn' onClick={this.props.add}>+1</Button>
                <Button className='dec_btn' onClick={this.props.dec}>-2</Button>
                <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
                <View><Text>{this.props.counter.num}</Text></View>
                <View><Text>Hello, World</Text></View>
            </View>
        )
    }
}

export default connect(({ counter }) => ({
    counter
}), (dispatch) => ({
    add() {
        dispatch(add())
    },
    dec() {
        dispatch(minus())
    },
    asyncAdd() {
        dispatch(asyncAdd())
    }
}))(Test)
