import { takeLatest } from 'redux-saga/effects'
import axios from 'axios'

import { USER_LOGIN_REQUEST,
         USER_LOGOUT_REQUEST,
         USER_AUTHENTICATED_BY_TOKEN_FOUND,
         CREATE_USER_REQUEST,
         UPDATE_USER_REQUEST,
         DELETE_USER_REQUEST,
         GET_ALL_USERS_REQUEST,
         GET_USERS_BY_NAME_LIKE_REQUEST,
         GET_USER_BY_ID_REQUEST,
         USER_SELECTED_IN_LIST,
         GET_TIMEZONES_REQUEST,
                                } from '../types/userActionTypes' 

import { LOAD_SIMPLE_TEST_DATA_REQUEST } from '../types/simpleTestActionTypes'

import { CREATE_RUN_REQUEST,
         UPDATE_RUN_REQUEST,
         GET_RUNS_REQUEST,
         GET_RUN_BY_ID_REQUEST,
         USER_RUNS_SELECTED_IN_LIST,
         GET_RUNS_BY_USER_ID_REQUEST,
         DELETE_RUN_REQUEST,
         RUN_SELECTED_IN_LIST,  
         RUNS_LIST_UNIT_OPTION } from '../types/runActionTypes'
 
import { postUserLogin, 
         postUserLogout, 
         putUserAuthenticatedByTokenFound,
         postNewUser, 
         getAllUsrRequest,
         getAllUsrByNameLikeRequest,
         getUserRequest,         
         getUserRunsSelectedInList,
         userSelectedInList,
         updateUserRequest,
         deleteUsrRequest,
         getTmzRequest }  from './userSagas'

import { getAllRunsRequest,
         getAllRunsByUserIdRequest,
         runSelectedInList,
         updateRunRequest,
         getRunRequest,
         postNewRun,
         deleteRnRequest,
         setRunsLstUnitOption } from './runSagas'

import getSimpleTest from './simpleTestSagas'

function *indexSagas () {
    try {
      yield( takeLatest(LOAD_SIMPLE_TEST_DATA_REQUEST, getSimpleTest, axios ) )   

      yield( takeLatest(USER_LOGIN_REQUEST, postUserLogin, axios) ) 
      yield( takeLatest(USER_LOGOUT_REQUEST, postUserLogout) )
      yield( takeLatest(USER_AUTHENTICATED_BY_TOKEN_FOUND, putUserAuthenticatedByTokenFound) ) 
      yield( takeLatest(CREATE_USER_REQUEST, postNewUser, axios) )
      yield( takeLatest(UPDATE_USER_REQUEST, updateUserRequest, axios) )
      yield( takeLatest(DELETE_USER_REQUEST, deleteUsrRequest, axios) )
      yield( takeLatest(GET_ALL_USERS_REQUEST, getAllUsrRequest, axios) )
      yield( takeLatest(GET_USERS_BY_NAME_LIKE_REQUEST, getAllUsrByNameLikeRequest, axios) )
      yield( takeLatest(GET_USER_BY_ID_REQUEST, getUserRequest, axios) )
      yield( takeLatest(USER_SELECTED_IN_LIST, userSelectedInList) )
      yield( takeLatest(USER_RUNS_SELECTED_IN_LIST, getUserRunsSelectedInList, axios) )

      yield( takeLatest(GET_TIMEZONES_REQUEST, getTmzRequest, axios) )

      yield( takeLatest(DELETE_RUN_REQUEST, deleteRnRequest, axios) )
      yield( takeLatest(GET_RUNS_REQUEST, getAllRunsRequest, axios) )
      yield( takeLatest(GET_RUNS_BY_USER_ID_REQUEST, getAllRunsByUserIdRequest, axios) )
      yield( takeLatest(RUN_SELECTED_IN_LIST, runSelectedInList) )
      yield( takeLatest(GET_RUN_BY_ID_REQUEST, getRunRequest, axios) )
      yield( takeLatest(CREATE_RUN_REQUEST, postNewRun, axios) )
      yield( takeLatest(UPDATE_RUN_REQUEST, updateRunRequest, axios) )
      yield( takeLatest(RUNS_LIST_UNIT_OPTION, setRunsLstUnitOption) )      
      
    }
    catch(e) {
    } 
}
export default indexSagas