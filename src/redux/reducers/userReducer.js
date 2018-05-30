import { USER_LOGIN_REQUEST,
         USER_LOGIN_SUCCESS,
         ERROR_USER_MESSAGE,
         USER_LOGOUT_REQUEST,

         USER_AUTHENTICATED_BY_TOKEN_FOUND,

         CREATE_USER_REQUEST,
         CREATE_USER_ERROR,

         UPDATE_USER_REQUEST,
         UPDATE_USER_SUCCESS,

         GET_ALL_USERS_REQUEST,
         GET_ALL_USERS_SUCCESS,
         GET_ALL_USERS_ERROR,

         GET_USER_BY_ID_REQUEST,
         GET_USER_BY_ID_SUCCESS,

         GET_USERS_BY_NAME_LIKE_REQUEST,
         GET_USERS_BY_NAME_LIKE_SUCCESS,

         USER_SELECTED_IN_LIST,
         GET_NAME_USER_RUNS_SUCESS,         

         GET_TIMEZONES_REQUEST,
         GET_TIMEZONES_SUCCESS,

         OPEN_PROFILE_REQUEST,
         OPEN_PROFILE_SUCCESS,

         DONT_WANNA_WAIT,
        
        } from '../types/userActionTypes'

import { USER_RUNS_SELECTED_IN_LIST, 
         RESET_USER_RUNS_SELECTED_IN_LIST
                                          } from '../types/runActionTypes'

const INITIAL_STATE = { 
    data: [],
    dataRegUser: [],
    dataAllUsers: [],
    dataAllUsersLike: [],
    timezones:[],

    idUserSelected: -1,
    regUserLoaded: false,
    creatingUserFromList: false,

    loggedUser_id: -1,
    loggedUser_name: '',
    loggedUser_email: '',
    loggedUser_role: '',
    loggedUser_unit: '',
    loggedUser_timezone: '',
    keepmeloggedin: false,

    authenticated: false,
    allUsersLoaded: false,
    updateSuccess: false,
    openMyProfile: false,
    loginSuccess: false,
    isFetching: false, 
    isFetchingAllUsers: false,
    isFetchingAllUsersLike: false,
    fromList: false, 
    loginOk: false,
    error: false,
    dontWannaWait: false,
    errorUserMessage: '',
    nameUserRunsSelectedInList: '',
}
const userReducer = (state = INITIAL_STATE, action) => {
  switch(action.type){
    case DONT_WANNA_WAIT:
      return {
        ...state,
        dontWannaWait: true,
        isFetching: false, 
        isFetchingAllUsers: false,
        isFetchingAllUsersLike: false,
        error: false,
      }
    case CREATE_USER_REQUEST:
      return{
        ...state,
        data: [],
        error: false,
        errorUserMessage: ''
    } 
    case CREATE_USER_ERROR:
      return {
        ...state,
        error: true,
        errorUserMessage: action.errorUserMessage
      }
    case USER_AUTHENTICATED_BY_TOKEN_FOUND:
    case USER_LOGIN_REQUEST:      
      return {
        ...state, 
        data: [],
        error: false,
        loginOk: false,
        errorUserMessage: '',
        isFetching: true,
        authenticated: true,
        keepmeloggedin: action.keepmeloggedin
      }
    case USER_LOGIN_SUCCESS:
      return {
        ...state,         
        loggedUser_id: action.id,
        loggedUser_name: action.name,
        loggedUser_email: action.email,
        loggedUser_role: action.role,
        loggedUser_unit: action.unit,
        loggedUser_timezone: action.timezone,      

        error: false,
        loginOk: true,
        isFetching: false,
        authenticated: true,
        loginSuccess: true,
        keepmeloggedin: action.keepmeloggedin
      }
    case ERROR_USER_MESSAGE:
      return {
        ...state,
        isFetching: false,
        errorUserMessage: action.errorUserMessage,
        error: true
      }
    case USER_LOGOUT_REQUEST:      
      return {
        state: INITIAL_STATE
      }
    case USER_SELECTED_IN_LIST:
      return {
        ...state,
        idUserSelected: action.idUserSelected,
        isFetching: action.idUserSelected!==-2 ? true : false,
        creatingUserFromList: action.idUserSelected===-2 ? true : false,
        regUserLoaded: false,
        dataRegUser: [],
        fromList: true,
        error: false
      }
    case GET_USER_BY_ID_REQUEST:
      return {
        ...state, 
        isFetching: true,
        dataRegUser: [],
        regUserLoaded: false,
        error: false
      }  
    case GET_USER_BY_ID_SUCCESS:
      return {
        ...state, 
        dataRegUser: action.dataRegUser,
        regUserLoaded: true,       
        isFetching: false,
        error: false
      }
    case RESET_USER_RUNS_SELECTED_IN_LIST:
      return {
        ...state,
        isFetching: false,
        nameUserRunsSelectedInList: ''
      }
    case USER_RUNS_SELECTED_IN_LIST:
      return {
        ...state,
        isFetching: true,
        nameUserRunsSelectedInList: ''
      }
    case GET_NAME_USER_RUNS_SUCESS:
      return {
        ...state,
        isFetching: false,
        nameUserRunsSelectedInList: action.userName
      }
    case UPDATE_USER_REQUEST:
      return {
        ...state,
        regUserLoaded: false,
        updateSuccess: false,
        isFetching: true,
        dataRegUser: [],
        error: false
      }  
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        dataRegUser: action.dataRegUser,         
        updateSuccess: true,
        isFetching: false,        
        error: false
      }    
    case GET_ALL_USERS_REQUEST:
      return {
        ...state,
        creatingUserFromList: false,
        allUsersLoaded: false,
        isFetching: true,
        isFetchingAllUsers: true,
        dataAllUsers: [],
        idUserSelected: -1,
        fromList: false,
        error: false,
        dontWannaWait: false,
      }  
    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFetchingAllUsers: false,
        dataAllUsers: (state.dontWannaWait ? state.dataAllUsers : action.dataAllUsers),
        allUsersLoaded: (state.dontWannaWait ? false : true),
        dontWannaWait: false,        
        idUserSelected: -1,
        error: false
      }    
    case GET_USERS_BY_NAME_LIKE_REQUEST:
      return {
        ...state,
        isFetchingAllUsersLike: true,
        dataAllUsersLike: [],
        error: false
      }
    case GET_USERS_BY_NAME_LIKE_SUCCESS:
      return {
        ...state,
        isFetchingAllUsersLike: false,
        dataAllUsersLike: action.dataAllUsersLike,
        error: false
      }
    case GET_ALL_USERS_ERROR:
      return {
        ...state,
        isFetching: false,
        data: action.data,
        error: true
      }
    case GET_TIMEZONES_REQUEST:
      return {
        ...state,
        timezones: []
      }
    case GET_TIMEZONES_SUCCESS:
      return {
        ...state,
        timezones: action.data
      }
    case OPEN_PROFILE_REQUEST:
      return {
        ...state,
        openMyProfile: true
      }
    case OPEN_PROFILE_SUCCESS:
      return {
        ...state,
        openMyProfile: false
      }
    default:
      return state
  }
}
export default userReducer