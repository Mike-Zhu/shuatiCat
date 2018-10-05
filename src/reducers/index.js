import { combineReducers } from 'redux'
import counter from './counter'
import select from './select'

export default combineReducers({
  counter,
  select
})
