import { OPEN_MODAL,
         CLOSE_MODAL,
         SET_MODAL_OBJ,
         INCREMENT_WAITING_TIME,
         SET_IS_COUNTING_WAITING_TIME } from '../types/modalActionTypes'

const INITIAL_STATE = {
  modals: [],
  modalObj: {},
  isCountingWaitingTime: false,
  waitingTime: 0,
}
const modalReducer = (state = INITIAL_STATE, action) => {
  switch(action.type){
    case OPEN_MODAL:
      return {
        ...state,
        modals: state.modals.concat(action.obj)
      }
    case CLOSE_MODAL:
      return {
        ...state,
        modalObj: {},
        modals: state.modals.filter(item => item.id !== action.obj.id),
      }
    case SET_MODAL_OBJ:
      return {
        ...state,
        modalObj: action.obj
      }
    case INCREMENT_WAITING_TIME:
      return {
        ...state,
        waitingTime: state.waitingTime + 1
      }
    case SET_IS_COUNTING_WAITING_TIME:
      return {
        ...state,
        waitingTime: 0,
        isCountingWaitingTime: action.value
      }
    default:
      return state
  }
}
export default modalReducer