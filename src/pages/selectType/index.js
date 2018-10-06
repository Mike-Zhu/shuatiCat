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
export default class SelectType extends Component {
    constructor(props) {
        super(props)
    }

    api = {
        getSecondType: "api/getSecondType"
    }
    config = {
        "backgroundTextStyle": "light",
        "navigationBarBackgroundColor": "#FF6961",
        "navigationBarTitleText": this.$router.params.secondType,
        "navigationBarTextStyle": "#fff",
    }
    async componentDidMount() {
        let { secondType } = this.$router.params
        let { select: { secondType: typelist } } = this.props

        for (let i = 0; i < typelist.length; i++) {
            let { content } = typelist[i]
            content.forEach(element => {
                if (element.secondType === secondType) {
                    this.props.dispatch({
                        type: 'setMinType',
                        payload: element.content
                    })
                }
            });
        }
    }
    routeGo() {

    }
    render() {
        let { select: { minType } } = this.props
        console.log(minType)
        return (
            <View className="select">
                {minType.map(content => (
                    <View class="content" key={content}>
                        {content}
                        <Button onClick={this.routeGo} data-value="college">SELECT</Button>
                    </View>
                ))}
            </View>
        )
    }
}

