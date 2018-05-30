import { put } from 'redux-saga/effects'
import { createRunError,
         updateRunSuccess,
         getRunsRequest,
         getRunsSuccess,
         getRunsError,
         getRunByIdRequest,
         getRunByIdSuccess,
         getRunsByUserIdRequest,
         genericRunError } from '../actions'

import decode from 'jwt-decode'
import moment from 'moment-timezone'

import { isArray } from 'util'

const baseURL = '/api/' 

function secondsToHms(d) {
  d = Number(d)
  var h = Math.floor(d / 3600)
  var m = Math.floor(d % 3600 / 60)
  var s = Math.floor(d % 3600 % 60)

  var hDisplay = h === 0 ? '00' : h < 10 ? '0' + h : h
  var mDisplay = m === 0 ? '00' : m < 10 ? '0' + m : m
  var sDisplay = s === 0 ? '00' : s < 10 ? '0' + s : s
  
  return hDisplay + ':' + mDisplay + ':' + sDisplay; 
}
function hmsToSeconds(fulltime){
  var hms = fulltime === undefined ? '02:04:33' : fulltime 
  var a = hms.split(':')                                   

  var seconds = ((+a[0]) * 60 * 60) + ((+a[1]) * 60) + (+a[2])  
  return seconds
}
function formatNumber(text){
  return Intl.NumberFormat('en-US', {  style: 'decimal' }).format(text)
}
function convertToUserDateTime(dados, unitOption){
  var updated = []
  if (dados.data.data) {
    dados.data.data.forEach(function(reg) {
      var londonDateTime = moment.tz(reg.created,'Europe/London')
      reg.created =
        londonDateTime.clone().tz(reg.timezone)
           .format().replace('T',' ').substring(0,19)
      reg.unit = reg.unit==="metric"?"km":"mi"
      if (unitOption!=="both"){
        if (reg.unit==="km" && unitOption==="imperial"){
          reg.distance = (reg.distance*0.62137).toFixed(2)
          reg.unit="mi"
        } else
        if (reg.unit==="mi" && unitOption==="metric"){
          reg.distance = (reg.distance*1.60934).toFixed(2)
          reg.unit="km"
        }
      }
      reg.distance = formatNumber(reg.distance)
      reg.duration = secondsToHms(reg.duration)
      updated.push(reg)
    }) 
    return updated
  } else
  if (dados.data){
      var londonDateTime = moment.tz(dados.data.created,'Europe/London')
      dados.data.created =
        londonDateTime.clone().tz(dados.data.timezone)
           .format().replace('T',' ').substring(0,19)
  }
  return dados.data
}
export function *postNewRun(axios, action){
    let { friendly_name, duration, distance } = action
    duration = yield hmsToSeconds(duration)
    const created =
      (moment.tz("Europe/London").format()).replace('T',' ').substring(0,19)
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
      const dataNewRun = yield rest.post('runs', { friendly_name, duration, distance, created })
      if (dataNewRun.data.error) {
        yield put(createRunError(dataNewRun.data.message))
      } else {        
        const decoded = decode(token)
        const dados = (action.idUserRunSelected <= 0) ?
           yield rest.get('runs?admin='+(decoded.role==='admin')) :
           yield rest.get('runs/user/' + decoded.id + '?admin=true')
        yield put(getRunsSuccess(convertToUserDateTime(dados)))
      } 
    }
    catch(e) {
      yield put(createRunError(e))
    } 
}

export function *updateRunRequest(axios, action){
  let { friendly_name, duration, created, timezone, distance } = action
  duration = hmsToSeconds(duration)
  const token = localStorage.getItem('user')
  const rest = axios.create({
      baseURL: baseURL,
      headers:{
        Authorization: 'Bearer ' + token
      }
  })
  try {
    var regDateTimeZone = moment.tz(created.replace('T',' ').substring(0,19), timezone)
    created =
      regDateTimeZone.clone().tz('Europe/London')
         .format().replace('T',' ').substring(0,19)
    
    yield rest.patch('runs/' + action.id, { friendly_name, duration, created, distance })
    if (action.fromList){
      yield put(getRunsRequest())
    }
    else{
      const dados = yield rest.get('runs/' + action.id)
      yield put(updateRunSuccess(convertToUserDateTime(dados)))
    }
  }
  catch(e) {
    yield put(genericRunError(e.response))
  } 
}
export function *getAllRunsRequest(axios, action){
  const token = localStorage.getItem('user')
  const rest = axios.create({
      baseURL: baseURL,
      headers:{
        Authorization: 'Bearer ' + token
      }
  })
  try {
    const decoded = decode(token)
    let dados = yield rest.get('runs?admin='+(decoded.role==='admin'))
    yield put(getRunsSuccess(convertToUserDateTime(dados, action.runsListUnitOption))) 
  }
  catch(e) {
      yield put(getRunsError('There\'s something wrong... :(  ' + JSON.stringify(e)))
  }
}
export function *getAllRunsByUserIdRequest(axios, action){
  const token = localStorage.getItem('user')
  const rest = axios.create({
      baseURL: baseURL,
      headers:{
        Authorization: 'Bearer ' + token
      }
  })
  try {
    const dados = yield rest.get('runs/user/' + action.userId + '?admin=true')
    yield put(getRunsSuccess(convertToUserDateTime(dados, action.runsListUnitOption)))
  }
  catch(e) {
      yield put(getRunsError('There\'s something wrong... :('))
  }
}
export function *runSelectedInList(action){
  if (action.idRunSelected!==-2){
    yield put(getRunByIdRequest(action.idRunSelected, false))
  }
} 
export function *getRunRequest(axios, action){  
  const token = localStorage.getItem('user')        
  const rest = axios.create({
    baseURL: baseURL,
    headers:{
      Authorization: 'Bearer ' + token
    }
  })
  try {
    const dados = yield rest.get('runs/' + action.id)
    if (dados.data){
      let user_id = dados.data.user_id
      const decoded = decode(token)      
      const userData = 
        yield rest.get('users'+(user_id===decoded.id ? "/me" : "/" + user_id))
      dados.data["timezone"] = (isArray(userData.data) ?
                                userData.data[0].timezone :
                                userData.data.timezone)
      dados.data["unit"] = (isArray(userData.data) ?
                            userData.data[0].unit :
                            userData.data.unit)
      dados.data.duration = secondsToHms(dados.data.duration)
      yield put(getRunByIdSuccess(convertToUserDateTime(dados)))
    } else {
      yield put(getRunByIdSuccess(dados))
    }
  }
  catch(e) {
    yield put(genericRunError(e.response))
  } 
}
export function *deleteRnRequest(axios, action){
  const token = localStorage.getItem('user')
  const rest = axios.create({
      baseURL: baseURL,
      headers:{
        Authorization: 'Bearer ' + token
      }
  })
  try {
    let dados = yield rest.delete('runs/' + action.id)
    if (dados.data.success){      
      dados = yield rest.get('runs')
      yield put(getRunsSuccess(convertToUserDateTime(dados)))
    } else {
      yield put(getRunsError('The task could not be done. Please, try again later.'))
    }
  }
  catch(e) {
    yield put(genericRunError(e.response))
  }   
}
export function *setRunsLstUnitOption(action){
  if (action.idUserRunSelected > 0){
    yield put(getRunsByUserIdRequest(action.idUserRunSelected, action.runsListUnitOption))
  } else {
    yield put(getRunsRequest(action.runsListUnitOption))
  }
}