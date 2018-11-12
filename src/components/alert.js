import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'

export default class LoginStatus extends Component {
    render() {
        const isLoggedIn = this.props.isLoggedIn
        // 这里最好初始化声明为 `null`，初始化又不赋值的话
        // 小程序可能会报警为变量为 undefined
        let status = null
        if (isLoggedIn) {
            status = <Text>已登录</Text>
        } else {
            status = <Text>未登录</Text>
        }

        return (
            <View>
                {status}
            </View>
        )
    }
}