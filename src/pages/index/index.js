import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
// import * as echarts from '../../components/ec-canvas/echarts';



const initChart = (canvas, width, height) => {
  console.log(canvas, width, height)
}

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({

}))
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ec: {
        onInit: initChart
      }
    }
  }

  componentDidMount() {
    let questionBank = Taro.getStorageSync('questionBank')
    let questionInfo = Taro.getStorageSync('questionInfo')
    let paperId = Taro.getStorageSync('paperId')
    if (!paperId) {
      console.log('没有存储当前题库')
      return
    }
    let bank = questionBank
      ? JSON.parse(questionBank)
      : {}
    let info = questionInfo
      ? JSON.parse(questionInfo)
      : {}
    this.bank = bank
    this.info = info[paperId] || {}
    console.log(bank)
    console.log(info)
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

  whritNewQuestion() {
    Taro.navigateTo({
      url: `/pages/detail/index`
    })
  }

  whritWrongQuestion() {

  }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className='main'>
        <View className="select-paper">
          <Text className="title">2016 海南高考</Text>
          <Button onClick={this.routeGo} data-value="college">SELECT</Button>
        </View>
        <View>
          <Button onClick={this.whritNewQuestion}>刷新题</Button>
        </View>
        <View>
          <Button>刷错题</Button>
        </View>
        {/* <View>
          <ec-canvas id='mychart-dom-area' canvas-id='mychart-area' ec={this.state.ec}></ec-canvas>
        </View> */}
      </View>
    )
  }
} 
