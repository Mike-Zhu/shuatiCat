import { combineReducers } from 'redux'
import counter from './counter'
import select from './select'
import current from './current'

export default combineReducers({
  counter,
  select,
  current
})
