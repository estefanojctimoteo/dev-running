import { 
         GET_RUN_BY_ID_REQUEST,
         GET_RUN_BY_ID_SUCCESS,

         USER_RUNS_SELECTED_IN_LIST,
         RESET_USER_RUNS_SELECTED_IN_LIST,
         RUN_SELECTED_IN_LIST,

         GET_RUNS_REQUEST,
         GET_RUNS_SUCCESS,
        
         GENERIC_RUN_ERROR,
         RUNS_LIST_UNIT_OPTION,
        
         DONT_WANNA_WAIT,
        
        } from '../types/runActionTypes'

const INITIAL_STATE = {
  data: [],
  dataAllRuns: [],
  dataRegRun: [],

  idRunSelected: -1,
  idUserRunSelected: -1, 

  regRunLoaded: false,
  creatingRunFromList: false,  

  allRunsLoaded: false,  
  isFetching: false,
  fromList: false,  
  error: false,
  errorRunMessage: '',
  runsListUnitOption: 'both'
}
const runReducer = (state = INITIAL_STATE, action) => {
  switch(action.type){
    case DONT_WANNA_WAIT:
      return {
        ...state,
        isFetching: false,
        error: false,
      }
    case GET_RUNS_REQUEST:
      return {
        ...state,
        allRunsLoaded: false,
        isFetching: true,
        dataAllRuns: [],
        idRunSelected: -1,
        idUserRunSelected: -1,
        creatingRunFromList: false,
        fromList: false,
        error: false
      }  
    case GET_RUNS_SUCCESS:
      return {
        ...state,
        allRunsLoaded: true,
        isFetching: false,
        dataAllRuns: action.dataAllRuns,
        idRunSelected: -1,
        error: false
      }
    case GENERIC_RUN_ERROR:
      return {
        ...state,
        isFetching: false,
        error: true,
        errorRunMessage: action.errorRunMessage
      }
    case USER_RUNS_SELECTED_IN_LIST:
      return {
        ...state,
        idUserRunSelected: action.idUserRunSelected
      }
    case RESET_USER_RUNS_SELECTED_IN_LIST:
      return{
        ...state,
        idUserRunSelected: -1
      }
    case RUN_SELECTED_IN_LIST:
      return {
        ...state,
        idRunSelected: action.idRunSelected,
        isFetching: action.idRunSelected!==-2 ? true : false,
        creatingRunFromList: action.idRunSelected===-2 ? true : false, 
        regRunLoaded: false,
        dataRegRun: [],
        fromList: true,        
        error: false
      }
    case GET_RUN_BY_ID_REQUEST:
      return {
        ...state, 
        isFetching: true,
        dataRegRun: [],
        regRunLoaded: false,
        error: false
      }  
    case GET_RUN_BY_ID_SUCCESS:
      return {
        ...state, 
        dataRegRun: action.dataRegRun, 
        regRunLoaded: true,       
        isFetching: false,
        error: false
      }
    case RUNS_LIST_UNIT_OPTION:
      return{
        ...state,
        runsListUnitOption: action.runsListUnitOption
      }
    default:
      return state
  }
}
export default runReducer