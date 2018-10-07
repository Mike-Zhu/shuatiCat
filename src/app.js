import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'
import College from './pages/college'
import SelectType from './pages/selectType'
import SelectPaper from './pages/selectPaper'
import Detail from './pages/Detail'

import configStore from './store'

import './app.scss'

const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/college/index',
      'pages/selectType/index',
      'pages/selectPaper/index',
      'pages/detail/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Index />
        <SelectPaper />
        <College />
        <SelectType />
        <Detail />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
