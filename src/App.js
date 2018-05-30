import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom"
import './App.css'
import MenuAppBar from './MenuAppBar'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { createMuiTheme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper' 

import PropTypes from 'prop-types'

import Logout from './services/Logout'

import UsersList from './lists/UsersList'
import RunsList from "./lists/RunsList"

import Home from './components/nav/general/Home'
import Public from './components/nav/general/Public'
import SimpleTest from './components/nav/general/SimpleTest'

import AddPropsToComponent from './components/hoc/AddPropsToComponent'
import MyProfile from './components/nav/users/MyProfile'
import NewRegister from './components/nav/users/NewRegister'

import ModalContainer from './components/dialog/ModalContainer'

import LoginPage from './forms/LoginPage'

import decode from 'jwt-decode'

import { openModal } from './redux/actions'

import { connect } from 'react-redux'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#7986CB',
      main: '#4394db', 
      dark: '#4394db',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#999999',
      main: '#10234f',
      dark: '#1f1311',
      contrastText: '#eecf8f',
    },
    appBar: {
      color: 'primary'
    },
  },
})

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },  
})

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      authenticated: false,
      userId: -1,
      email: '',
      role: 'user'
    }
  }
  componentWillReceiveProps(nextProps){
    if (this.props.modalObj !== nextProps.modalObj && nextProps.modalObj.id && nextProps.modalObj.id !== undefined && nextProps.modalObj.id !== '') {
      this.props.dispatch(openModal(nextProps.modalObj))
    } else
    if (this.props.loggedUser_id===-1 && nextProps.loggedUser_id > 0){
        this.setState({ authenticated : true, 
                        userId: nextProps.loggedUser_id,
                        email: nextProps.loggedUser_email,
                        role: nextProps.loggedUser_role })
    }
  }
  componentDidMount() {
    this.setTimer()
  }  
  setTimer() {
    this.timeout = setTimeout(this.updateClock.bind(this), 3000)
  }  
  updateClock() {
    this.setState(this.getTime, this.setTimer)  
    this.checkToken()    
  }  
  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }  
  componentWillMount(){
    this.checkToken()
  }
  checkToken(){
    let token = localStorage.getItem('user') 
    if (token){
      let decoded = decode(token)
      if ((this.props.loginSuccess && !this.state.authenticated) ||
           ((this.props.loggedUser_id===-1 || decoded.keepmeloggedin) && 
            (JSON.stringify(this.state.userId) !== JSON.stringify(decoded.id) 
             || JSON.stringify(this.state.email) !== JSON.stringify(decoded.email)
             || JSON.stringify(this.state.role) !== JSON.stringify(decoded.role)))){
        this.setState({ authenticated : true, 
                        userId: decoded.id,
                        email: decoded.email,
                        role: decoded.role })
      }
    } else {
      this.setState({ authenticated : false,
                      userId: -1,
                      email: '',
                      role: 'user' })
    }
  }  
  render() {
    const { authenticated, role } = this.state    
    const { classes } = this.props
    return (
      <Router>
      <div className="App">
        <ModalContainer />
        <MuiThemeProvider theme={theme}>
            <MenuAppBar authenticated={authenticated} role={role} />
              <div className={classes.root}>
                <Grid container spacing={24} direction="row">
                  <Grid item xs={12}> 
                    <Paper className={classes.paper} elevation={0}>
                      <Route exact path="/" component={Home} />
                      <Route path="/public/:fromLoginOrRegister?" component={AddPropsToComponent(Public)} />
                      <Route path="/simpleTest" component={SimpleTest} />
                      <Route path="/register" component={NewRegister} />
                      <Route path="/usersList" component={UsersList} />
                      <Route path="/runsList" component={RunsList} />
                      <Route path="/myprofile" component={MyProfile} />
                      <Route path="/loginPage" component={LoginPage} />
                      <Route path="/logout" component={Logout} />
                    </Paper>
                  </Grid>                  
                </Grid>
              </div>
        </MuiThemeProvider>        
      </div>
      </Router>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
}
export const AppContainer = connect(
  function mapStateToProps(state){
    return {
      modalObj: state.modalReducer.modalObj,
      loggedUser_id: state.userReducer.loggedUser_id,
      loggedUser_email: state.userReducer.loggedUser_email,
      loggedUser_role: state.userReducer.loggedUser_role,  
      loginSuccess: state.userReducer.loginSuccess,
    }  
  },
  function mapDispatchToProps(dispatch){
    return {
      dispatch,
    }
  },  
)(withStyles(styles)(App))