import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'
// import * as echarts from '../../components/ec-canvas/echarts';

import './index.scss'


const initChart = (canvas, width, height) => {
  console.log(canvas, width, height)
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ec: {
        onInit: initChart
      }
    }
  }

  config = {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#FF6961",
    "navigationBarTitleText": "刷题猫",
    "navigationBarTextStyle": "#fff",
    usingComponents: {
      'ec-canvas': '../../components/ec-canvas/ec-canvas' // 书写第三方组件的相对路径
    }
  }

  routeGo(e) {
    let dataset = e.target.dataset || {}
    let { value } = dataset
    Taro.navigateTo({
      url: `/pages/${value}/index`
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className='main'>
        <View className="select-paper">
          <Text className="title">2016 海南高考</Text>
          <Button onClick={this.routeGo} data-value="college">SELECT</Button>
        </View>
        {/* <View>
          <ec-canvas id='mychart-dom-area' canvas-id='mychart-area' ec={this.state.ec}></ec-canvas>
        </View> */}
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
}))(Index)
