import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import * as echarts from '../../components/ec-canvas/echarts';
import { newPaper, pieOption, rememberPaper } from '../../service/detailController';



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
      paperName: "default",
      ec: {
        onInit: initChart
      }
    }
  }

  async componentDidMount() {
    let questionBank = Taro.getStorageSync('questionBank')
    let questionInfo = Taro.getStorageSync('questionInfo')
    let paperId = Taro.getStorageSync('paperId')
    let paperName = Taro.getStorageSync('paperName', paperName)
    let clientInfo = await Taro.getSystemInfo()
    let { dispatch } = this.props
    dispatch({
      type: "setClientInfo",
      payload: clientInfo
    })
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
    this.setState({
      paperName
    })
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
          <Text className="title">{this.state.paperName}</Text>
          <Button onClick={this.routeGo} data-value="college">SELECT</Button>
        </View>
        <View>
          <Button onClick={this.whritNewQuestion}>刷新题</Button>
        </View>
        {/* <View>
          <Button>刷错题</Button>
        </View> */}
        {/* <View>
          <ec-canvas id='mychart-dom-area' canvas-id='mychart-area' ec={this.state.ec}></ec-canvas>
        </View> */}
      </View>
    )
  }
} 
