import React, { Component } from 'react'
import { NavLink } from "react-router-dom"

import Button from '@material-ui/core/Button'
import { flatButtonStyle } from '../../../Styles'

import { connect } from 'react-redux'

import decode from 'jwt-decode'

import { userAuthenticatedByTokenFound } from '../../../redux/actions'

class LoginLogout extends Component {
  componentDidMount(){
    if (this.props.loggedUser_id===-1){
      let token = localStorage.getItem("user")
      if (token){
        let decoded = decode(token)
        if (decoded.keepmeloggedin){
          this.props.userAuthenticatedByTokenFound(token)
        }
      }        
    }
  }
  render(){
    const { authenticated } = this.props
    return (
      <NavLink to={!authenticated ?"/loginPage":"/logout"} style={{ textDecoration:'none' }} >
        <Button onClick={this.handleLogin} style={flatButtonStyle}  >
          {!authenticated ? 'Login' : 'Logout'}
        </Button>
      </NavLink>
    )
  }
}
const mapStateToProps = (state) => {
  return {
      loggedUser_id: state.userReducer.loggedUser_id,
      keepmeloggedin: state.userReducer.keepmeloggedin,
      loginSuccess: state.userReducer.loginSuccess,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    userAuthenticatedByTokenFound: ( token ) => dispatch(userAuthenticatedByTokenFound( token ))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginLogout)