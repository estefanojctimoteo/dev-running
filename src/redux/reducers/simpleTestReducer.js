import { LOAD_SIMPLE_TEST_DATA_REQUEST,
         LOAD_SIMPLE_TEST_DATA_SUCCESS,
         LOAD_SIMPLE_TEST_DATA_FAILURE,
         DONT_WANNA_WAIT } from '../types/simpleTestActionTypes'

const INITIAL_STATE = {
  data: [],
  isFetching: false,
  error: false,
  dontWannaWait: false,
}
const simpleTestReducer = (state = INITIAL_STATE, action) => {
  if(action.type === DONT_WANNA_WAIT){
    return {
      ...state,
      dontWannaWait: true,
      isFetching: false, 
      error: false,
    }
  }
  if(action.type === LOAD_SIMPLE_TEST_DATA_REQUEST){
    return {
        isFetching: true,
        data: [],
        error: false,
        dontWannaWait: false,
      }
  }
  if(action.type === LOAD_SIMPLE_TEST_DATA_SUCCESS){
    return {
        isFetching: false,
        data: action.data,
        error: false
    }
  }  
  if(action.type === LOAD_SIMPLE_TEST_DATA_FAILURE){
    return {
        isFetching: false,
        data: [],
        error: true
    }
  }  
  return state
}
export default simpleTestReducer