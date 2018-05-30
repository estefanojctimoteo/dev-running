import { LOAD_SIMPLE_TEST_DATA_REQUEST,
         LOAD_SIMPLE_TEST_DATA_SUCCESS,
         DONT_WANNA_WAIT } from '../types/simpleTestActionTypes'

export const loadSimpleTestDataRequest = () => {
  return {
    type: LOAD_SIMPLE_TEST_DATA_REQUEST
  }
}
export const loadSimpleTestDataSuccess = (data) => {
  return {
      type: LOAD_SIMPLE_TEST_DATA_SUCCESS,
    data
  }
}
export const dontWannaWaitST = () => {
  return {
    type: DONT_WANNA_WAIT,      
  }
}
  