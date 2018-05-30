import { put, call } from 'redux-saga/effects'
import { loadSimpleTestDataSuccess } from '../actions'

const baseURL = '/api/'

function *getSimpleTest(axios){
    const dados = yield call(axios.get, baseURL)
    yield put(loadSimpleTestDataSuccess(dados.data)) 
}
export default getSimpleTest