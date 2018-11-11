import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import http, { user_id } from '../../service/http'
import './index.scss'
import * as echarts from '../../components/ec-canvas/echarts';
import { newPaper, rememberPaper } from '../../service/echartOption';
import {
  getWeekdayList,
  getNewQuestionInfo,
  getOldQuestionInfo
} from "../..//service/chartData"
import { getJSON } from "../../service/utils"

let chartCache = {} //存储chart

function getQuesOption(key, info) {
  let weekday = getWeekdayList()
  let isNewQuestion = key === "newQuestion"
  let newInfo = isNewQuestion ? getNewQuestionInfo(info) : getOldQuestionInfo(info)
  let option = isNewQuestion ? newPaper.option : rememberPaper.option

  option.series[0]["data"] = newInfo
  option.xAxis[0]["data"] = weekday
  return option
}

function initChartModel(key, that) {
  return function initChart(canvas, width, height) {
    let { info } = that
    let option = getQuesOption(key, info)
    const chart = echarts.init(canvas, null, {
      width,
      height
    });
    canvas.setChart(chart);
    chart.setOption(option);
    chartCache[key] = chart
    return chart;
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
        onInit: initChartModel('newQuestion', this)
      }
    }
  }
  api = {
    getQuestionInfoByPaperid: "api/getQuestionInfoByPaperid"
  }
  renderChart() {
    let chartArr = Object.keys(chartCache)
    chartArr.forEach(key => {
      let chart = chartCache[key]
      let option = getQuesOption(key, this.info)
      chart.setOption(option)
    })
  }

  async componentDidMount() {
    let questionBank = Taro.getStorageSync('questionBank')
    // let questionInfo = Taro.getStorageSync('questionInfo')
    // let info = getJSON(questionInfo)
    let paperId = Taro.getStorageSync('paperId')
    let paperName = Taro.getStorageSync('paperName', paperName)
    let clientInfo = await Taro.getSystemInfo()
    let { dispatch } = this.props
    let { api: { getQuestionInfoByPaperid } } = this

    dispatch({
      type: "setClientInfo",
      payload: clientInfo
    })

    if (!paperId) { throw new Error('没有存储当前题库') }
    this.bank = getJSON(questionBank)
    this.setState({ paperName })
    let info = await http.get(getQuestionInfoByPaperid, {
      user_id,
      paper_id: paperId
    })
    console.log(info)
    this.info = info && info.data && info.data[paperId]
    this.renderChart()
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
        <View className="echart-line-view">
          <ec-canvas id='mychart-dom-line' canvas-id='mychart-line' ec={this.state.ec}></ec-canvas>
        </View>
      </View>
    )
  }
} 
