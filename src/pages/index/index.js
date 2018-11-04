import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import * as echarts from '../../components/ec-canvas/echarts';
import { newPaper, rememberPaper } from '../../service/echartOption';

let chartCache = {} //存储chart
let callbackCache = {
  'ec1': ec1Deal,
  'ec2': ec2Deal,
}

function ec1Deal({ chartInfo, weekday }) {
  newPaper.option.series[0].data = chartInfo.beforeArray.map((value) => {
    return value.length
  })
  newPaper.option.xAxis[0].data = weekday
  return newPaper.option
}

function ec2Deal({ chartInfo, weekday }) {
  rememberPaper.option.series[0].data = chartInfo.futureArray
  rememberPaper.option.xAxis[0].data = weekday
  return rememberPaper.option
}

function initChartModel(callback, key) {
  return function initChart(canvas, width, height) {
    let option = callback(getQuesObj())
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
    chart.setOption(option);
    chartCache[key] = chart
    return chart;
  }
}

function getQuesObj() {
  return {
    chartInfo: questionMananger.getChartInfo(),
    weekday: questionMananger.getChartBeforeWeekday()
  }
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
        onInit: initChartModel(callbackCache['ec1'], 'ec1')
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
        <View>
          <ec-canvas id='mychart-dom-line' canvas-id='mychart-line' ec={this.state.ec}></ec-canvas>
        </View>
      </View>
    )
  }
} 
