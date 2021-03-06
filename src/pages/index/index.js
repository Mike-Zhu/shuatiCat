import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import http from '../../service/http'
import './index.scss'
import * as echarts from '../../components/ec-canvas/echarts';
import { newPaper, rememberPaper } from '../../service/echartOption';
import {
  getWeekdayList,
  getFutureWeekday,
  getNewQuestionInfo,
  getOldQuestionInfo,
  getTodayNumber,
  getOldNumber
} from "../..//service/chartData"
import { getJSON } from "../../service/utils"
import * as OptionController from '../../service/detailController'
import { wxLogin } from "../../service/login"

let isLogin = wxLogin()

let chartCache = {} //存储chart

function getQuesOption(key, info) {
  let isNewQuestion = key === "newQuestion"
  let weekday = isNewQuestion ? getWeekdayList() : getFutureWeekday()
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
}))
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paperName: "当前暂无题库信息",
      newQuestion: {
        onInit: initChartModel('newQuestion', this)
      },
      errorQuestion: {
        onInit: initChartModel('errorQuestion', this)
      },
      newNumber: 0,
      oldNumber: 0
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

  renderStateFromInfo() {
    let info = this.info
    let newNumber = getTodayNumber(info)
    let oldNumber = getOldNumber(info)
    this.setState({
      newNumber,
      oldNumber
    })
  }

  async componentDidMount() {
    let questionBank = Taro.getStorageSync('questionBank')
    let paperId = Taro.getStorageSync('paperId')
    let paperName = Taro.getStorageSync('paperName')
    let clientInfo = await Taro.getSystemInfo()
    let user_id = Taro.getStorageSync('user_id')
    let { dispatch } = this.props
    let { api: { getQuestionInfoByPaperid } } = this
    this.bank = getJSON(questionBank, [])
    dispatch({
      type: "setClientInfo",
      payload: clientInfo
    })

    if (!paperId) { return }//throw new Error('没有存储当前题库') }
    this.setState({ paperName })
    let info = await http.get(getQuestionInfoByPaperid, {
      user_id,
      paper_id: paperId
    })
    this.info = info && info.data && info.data[paperId]
    this.info = this.info || {}
    Taro.setStorageSync('questionInfo', JSON.stringify(this.info))
    this.renderChart()
    this.renderStateFromInfo()
  }

  config = {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#FF6961",
    "navigationBarTitleText": "刷题统计",
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
    let { dispatch } = this.props
    let { bank, info } = this
    let filterList = OptionController.getNewIndexList(info, bank)
    let isRight = filterList.length > 0
    if (!isRight) {
      Taro.showToast({
        title: "没有新题刷了",
        icon: "none"
      })
      return
    }
    //设置为新题模式
    dispatch({
      type: "setNewQuestion"
    })
    Taro.navigateTo({
      url: `/pages/detail/index`
    })
  }

  whritWrongQuestion() {
    let { dispatch } = this.props
    let { bank, info } = this
    let filterList = OptionController.getErrorIndexList(info, bank)
    let isRight = filterList.length > 0
    if (!isRight) {
      Taro.showToast({
        title: "没有错题刷了",
        icon: "none"
      })
      return
    }
    //设置为错题模式
    dispatch({
      type: "setErrorQuestion"
    })
    Taro.navigateTo({
      url: `/pages/detail/index`
    })
  }

  componentDidShow() {
    let questionInfo = Taro.getStorageSync('questionInfo')
    let info = getJSON(questionInfo)
    let paperName = Taro.getStorageSync('paperName')
    //因为echart的渲染与dom不同，所以这里info不用存在state里
    this.info = info
    this.renderChart()
    //这里刷新下paperName就可以
    this.state.paperName !== paperName && paperName && this.setState({ paperName })
    this.renderStateFromInfo()
  }

  componentDidHide() { }

  render() {
    return (
      <View className='main'>
        <View className="select-paper">
          <Text className="title">{this.state.paperName}</Text>
          <Button onClick={this.routeGo} data-value="college">选题库</Button>
        </View>
        <View className="echart-line-view">
          <Button className="button" onClick={this.whritNewQuestion}>刷新题</Button>
          <Text className="number">{this.state.newNumber}</Text>
          <Text className="title">今日刷题数量</Text>
          <ec-canvas id='mychart-dom-line' canvas-id='mychart-line' ec={this.state.newQuestion}></ec-canvas>
        </View>
        <View className="echart-line-view">
          <Button className="button" onClick={this.whritWrongQuestion}>刷错题</Button>
          <Text className="number">{this.state.oldNumber}</Text>
          <Text className="title">未来5日遗忘数量预测</Text>
          <ec-canvas id='mychart-dom-line' canvas-id='mychart-line' ec={this.state.errorQuestion}></ec-canvas>
        </View>
      </View>
    )
  }
} 
