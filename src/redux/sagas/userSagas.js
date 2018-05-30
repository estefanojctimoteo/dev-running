import { put, call } from 'redux-saga/effects'
import { createUserError,
         userLoginSuccess, 
         errorMessageToUser,
         updateUserSuccess,
         getAllUsersRequest,
         getAllUsersSuccess,
         getAllUsersByNameLikeSuccess,
         getAllUsersError,
         getUserByIdRequest,
         getUserByIdSuccess,
         getNameUserRunsSuccess,
         getTimezonesSuccess,
         resetUserRunsSelectedInList, } from '../actions'
import decode from 'jwt-decode'

import { isArray } from 'util'

const baseURL = '/api/'

export function *putUserAuthenticatedByTokenFound(action){
  const decoded = decode(action.token)
  yield put(userLoginSuccess(decoded.id, decoded.name, decoded.email, decoded.role, decoded.unit, decoded.timezone, decoded.keepmeloggedin)) 
}

export function *postUserLogin(axios, action){
    const { email, passwd, keepmeloggedin } = action
    try {
      const dados = yield call(axios.post, baseURL + 'users/login', { email, passwd, keepmeloggedin })
      if (dados.data && dados.data.error){
        yield put(errorMessageToUser(JSON.stringify(dados.data.message) ))
      }
      else {
        const decoded = decode(dados.data.token)        
        yield put(userLoginSuccess(decoded.id, decoded.name, decoded.email, decoded.role, decoded.unit, decoded.timezone, decoded.keepmeloggedin)) 
        localStorage.setItem('user', dados.data.token)      
      } 
    }
    catch(e) {
        if (JSON.stringify(e).indexOf('InvalidTokenError')!==-1){
           yield put(errorMessageToUser('Invalid user or password! :('))
         } else {
           yield put(errorMessageToUser('There\'s something wrong :(  ' + JSON.stringify(e.response.data) ))
        }
    } 
}

export function *userSelectedInList(action){
  if (action.idUserSelected!==-2){
    yield put(getUserByIdRequest(action.idUserSelected, false))
  }
}

export function *getUserRunsSelectedInList(axios, action){  
  const token = localStorage.getItem('user')
  const rest = axios.create({
    baseURL: baseURL,
    headers:{
      Authorization: 'Bearer ' + token
    }
  })
  try {
    if (action.me==="true" || action.idUserRunSelected > 0){
      const dados = yield rest.get('users'+(action.me===true ? "/me" : "/" + action.idUserRunSelected))
      //console.log('dados: ' + JSON.stringify(dados))
      yield put(getNameUserRunsSuccess(isArray(dados.data)?dados.data[0].name:dados.data.name))
    }
  }
  catch(e) {
  } 
}

export function *getUserRequest(axios, action){  
  const token = localStorage.getItem('user')
  const rest = axios.create({
    baseURL: baseURL,
    headers:{
      Authorization: 'Bearer ' + token
    }
  })
  try {
    if (action.me==="true" || action.id > 0){
      const dados = yield rest.get('users'+(action.me===true ? "/me" : "/" + action.id))
      yield put(getUserByIdSuccess(dados.data))
    }
  }
  catch(e) {
  } 
}

export function *postNewUser(axios, action){
    const { name, email, passwd, role, unit, timezone } = action
    const token = localStorage.getItem('user')        
    const rest = (token) ? 
      axios.create({
        baseURL: baseURL,
        headers:{
          Authorization: 'Bearer ' + token
        }
      }) : 
      axios.create({
        baseURL: baseURL
      })    
    try {
      const dataNewUser = yield rest.post('users', { name, email, passwd, role, unit, timezone })
      if (dataNewUser.data.error) {
        yield put(createUserError(dataNewUser.data.message))
      } else
      if (action.fromList){
        const dados = yield rest.get('users')
        yield put(getAllUsersSuccess(dados.data))     
      } else {
        const dados = yield call(axios.post, baseURL + 'users/login', { email, passwd })      
        const decoded = decode(dados.data.token)
        yield put(userLoginSuccess(decoded.id, decoded.name, decoded.email, decoded.role, decoded.unit, decoded.timezone, true)) 
        localStorage.setItem('user', dados.data.token)      
      }
    }
    catch(e) {
      yield put(createUserError(e))
    } 
}

export function *postUserLogout(){
    try {
      yield localStorage.removeItem('user')   
    }
    catch(e) {
    } 
}

export function *deleteUsrRequest(axios, action){
  const token = localStorage.getItem('user')
  const rest = axios.create({
      baseURL: baseURL,
      headers:{
        Authorization: 'Bearer ' + token
      }
  })
  try {
    let dados = yield rest.delete('users/' + action.id)
    dados = yield rest.get('users')
    yield put(getAllUsersSuccess(dados.data))     
  }
  catch(e) {
    if (e.response.data.error) {
        yield put(errorMessageToUser(e.response.statusText))
    }
  }   
}

export function *updateUserRequest(axios, action){
  let { name, email, passwd, role, unit, timezone } = action
  const token = localStorage.getItem('user')
  const rest = axios.create({
      baseURL: baseURL,
      headers:{
        Authorization: 'Bearer ' + token
      }
  })
  try {
    yield rest.patch('users/' + action.id, { name, email, passwd, role, unit, timezone })
    if (action.fromList){
      yield put(getAllUsersRequest())
    }
    else{ 
      const dados = yield rest.get('users'+(action.me===true ? "/me" : "/" + action.id))      
      console.log('put.updateuserSuccess.dados.data: ' + JSON.stringify(dados.data))
      yield put(updateUserSuccess(dados.data))
    }
  }
  catch(e) {
      if (e.indexOf('InvalidTokenError')!==-1){
        yield put(errorMessageToUser('Invalid user or password! :('))
      } else {
        yield put(errorMessageToUser('There\'s something wrong... :('))
      }
  } 
}
export function *getTmzRequest(axios){
  const api = axios.create({
    baseURL: 'http://localhost:3009/'
  })
  try {
    const dados = yield api.get('timezones')
    yield put(getTimezonesSuccess(dados.data))
  } catch (exc) {
    yield put(errorMessageToUser("error getTimezones: " + JSON.stringify(exc)))
  }
}
export function *getAllUsrRequest(axios, action){
  const token = localStorage.getItem('user')
  const rest = axios.create({
      baseURL: baseURL,
      headers:{
        Authorization: 'Bearer ' + token
      }
  })
  try {
  //const dados = yield rest.get('users')              // it works
    const dados = yield rest.get('users/withdelay/10') // it works with delay (forces modal)
    yield put(resetUserRunsSelectedInList())
    yield put(getAllUsersSuccess(dados.data)) 
  }
  catch(e) {
    if (e.indexOf('InvalidTokenError')!==-1){
      yield put(getAllUsersError('Invalid user or password! :('))
    } else {
      yield put(getAllUsersError('There\'s something wrong... :('))
    }
  }
}

export function *getAllUsrByNameLikeRequest(axios, action){
  const token = localStorage.getItem('user')
  const rest = axios.create({
      baseURL: baseURL,
      headers:{
        Authorization: 'Bearer ' + token
      }
  })
  try {
    const dados = yield rest.get('users/find/' + action.name)
    yield put(getAllUsersByNameLikeSuccess(dados.data)) 
  }
  catch(e) {
    if (e.indexOf('InvalidTokenError')!==-1){
      yield put(getAllUsersError('Invalid user or password! :('))
    } else {
      yield put(getAllUsersError('There\'s something wrong... :('))
    }
  }
}