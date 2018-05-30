import React from 'react'
import { render } from 'react-dom'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import { AppContainer } from './App'
import registerServiceWorker from './registerServiceWorker'
 
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducers from './redux/reducers/index'

import logger from 'redux-logger'

import createSagaMiddleware from 'redux-saga'
import indexSagas from './redux/sagas/indexSagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && 
  window.__REDUX_DEVTOOLS_EXTENSION__(),  
  applyMiddleware(sagaMiddleware, logger)
)

sagaMiddleware.run(indexSagas)

const alertOptions = {
  offset: '80px',
  position: 'top right',
  timeout: 6000,  
  transition: 'scale'
}

render(
 <AlertProvider template={AlertTemplate} {...alertOptions}>
   <Provider store={store}>
      <AppContainer />      
    </Provider>
 </AlertProvider>,
 document.getElementById('app'))
 
registerServiceWorker()