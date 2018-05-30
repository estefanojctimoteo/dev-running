import { combineReducers } from 'redux'

import runReducer from './runReducer'
import userReducer from './userReducer'
import modalReducer from './modalReducer'
import simpleTestReducer from './simpleTestReducer'

export default 
   combineReducers({ runReducer,
                     userReducer, 
                     modalReducer,                     
                     simpleTestReducer })