import { CREATE_RUN_REQUEST, 
         CREATE_RUN_ERROR,

         UPDATE_RUN_REQUEST,
         UPDATE_RUN_SUCCESS,

         GET_RUNS_REQUEST,
         GET_RUNS_SUCCESS, 
         GET_RUNS_ERROR,
        
         GET_RUN_BY_ID_REQUEST,
         GET_RUN_BY_ID_SUCCESS,
        
         GET_RUNS_BY_USER_ID_REQUEST,
         GET_RUNS_BY_USER_ID_SUCCESS,

         USER_RUNS_SELECTED_IN_LIST,
         RESET_USER_RUNS_SELECTED_IN_LIST,
         RUN_SELECTED_IN_LIST,

         DELETE_RUN_REQUEST,

         GENERIC_RUN_ERROR,

         RUNS_LIST_UNIT_OPTION,

         DONT_WANNA_WAIT,         
        
        } from '../types/runActionTypes'


export const createRunRequest = ( friendly_name, duration, distance, idUserRunSelected ) => {
  return {
    type: CREATE_RUN_REQUEST,
    friendly_name, duration, distance, idUserRunSelected 
  }
}
export const createRunError = ( errorRunMessage ) => {
  return {
    type: CREATE_RUN_ERROR,
    errorRunMessage
  }
}

export const genericRunError = ( errorRunMessage ) => {
  return {
    type: GENERIC_RUN_ERROR,
    errorRunMessage
  }
}

export const updateRunRequest = ( id, friendly_name, duration, created, timezone, distance, fromList ) => {
  return {
      type: UPDATE_RUN_REQUEST,
      id, friendly_name, duration, created, timezone, distance, fromList
  }
}
export const updateRunSuccess = (dataRegRun) => {
  return {
      type: UPDATE_RUN_SUCCESS,
      dataRegRun
  }
}

export const dontWannaWaitR = () => {
  return {
    type: DONT_WANNA_WAIT,      
  }
}

export const deleteRunRequest = ( id ) => {
  return {
      type: DELETE_RUN_REQUEST,
      id
  }
}

export const getRunsRequest = (runsListUnitOption) => {
  return {
    type: GET_RUNS_REQUEST,
    runsListUnitOption
  }
}
export const getRunsSuccess = (dataAllRuns) => {
  return {
      type: GET_RUNS_SUCCESS,
      dataAllRuns
  }
}
export const getRunsError = (errorRunMessage) => {
  return {
      type: GET_RUNS_ERROR,
      errorRunMessage
  }
}
export const getRunsByUserIdRequest = (userId, runsListUnitOption) => {
  return {
    type: GET_RUNS_BY_USER_ID_REQUEST,
    userId,
    runsListUnitOption
  }
}
export const getRunsByUserIdSuccess = (dataAllRuns, userId) => {
  return {
      type: GET_RUNS_BY_USER_ID_SUCCESS,
      dataAllRuns,
      userId
  }
}
export const getRunByIdRequest = ( id ) => {
  return {
      type: GET_RUN_BY_ID_REQUEST,
      id
  }
}
export const getRunByIdSuccess = ( dataRegRun ) => {
  return {
    type: GET_RUN_BY_ID_SUCCESS,
    dataRegRun
  }
}
export const userRunsSelectedInList = ( idUserRunSelected, me ) => {
  return {
    type: USER_RUNS_SELECTED_IN_LIST,
    idUserRunSelected,
    me
  }
}
export const resetUserRunsSelectedInList = () => {
  return {
    type: RESET_USER_RUNS_SELECTED_IN_LIST
  }
}
export const runSelectedInList = ( idRunSelected ) => {
  return {
    type: RUN_SELECTED_IN_LIST,
    idRunSelected 
  }
}
export const setRunsListUnitOption= ( runsListUnitOption, idUserRunSelected ) => {
  return {
    type: RUNS_LIST_UNIT_OPTION,
    runsListUnitOption,
    idUserRunSelected
  }
}