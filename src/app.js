import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'
import Test from './pages/test'
import College from './pages/college'
import SelectType from './pages/selectType'

import configStore from './store'

import './app.scss'

const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/test/index',
      'pages/college/index',
      'pages/selectType/index'
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
        <Test />
        <College />
        <SelectType />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
