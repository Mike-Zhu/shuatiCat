import { combineReducers } from 'redux'
import counter from './counter'
import select from './select'
import current from './current'
import detail from './detail'

export default combineReducers({
  counter,
  select,
  current,
  detail
})
