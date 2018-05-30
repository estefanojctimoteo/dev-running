import { OPEN_MODAL,
         CLOSE_MODAL,
         SET_MODAL_OBJ,
         INCREMENT_WAITING_TIME,
         SET_IS_COUNTING_WAITING_TIME } from '../types/modalActionTypes'

export const openModal = (obj) => {
  return {
    type: OPEN_MODAL,
    obj,
  }
}
export const closeModal = (obj) => {
  return {
    type: CLOSE_MODAL,
    obj,
  }
}
export const setModalObj = (obj) => {
  return {
    type: SET_MODAL_OBJ,
    obj
  }
}
export const incrementWaitingTime = () => {
  return {
    type: INCREMENT_WAITING_TIME
  }
}
export const setIsCountingWaitingTime = (value) => {
  return {
    type: SET_IS_COUNTING_WAITING_TIME,
    value
  }
}