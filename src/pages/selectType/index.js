import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
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
    routeGo(e) {
        let dataset = e.target.dataset || {}
        let value = dataset.value || {}
        Taro.navigateTo({
            url: `/pages/selectPaper/index?type=${value}`
        })
    }
    render() {
        let { select: { minType } } = this.props
        return (
            <View className="select">
                {minType.map(content => (
                    <View class="content" key={content}>
                        <Text>{content}</Text>
                        <Button onClick={this.routeGo} data-value={content}>SELECT</Button>
                    </View>
                ))}
            </View>
        )
    }
}

