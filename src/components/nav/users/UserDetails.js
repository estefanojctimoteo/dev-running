import React, { Component } from 'react'
import { NavLink } from "react-router-dom"
import { connect } from 'react-redux'

class UserDetails extends Component {
  render(){
    const { authenticated } = this.props
    return (
      <NavLink data-tip="My Profile" to="/myprofile" style={{ fontSize:'14px', fontFamily:'roboto, sans-serif', color:'rgb(255, 255, 255)', textDecoration:'none', display: (!authenticated ? 'none' : 'block')}} >
          {this.props.loggedUser_email}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|
      </NavLink>
    )   
  }
} 
const mapStateToProps = (state) => {
  return {
    loggedUser_email: state.userReducer.loggedUser_email,
    loginSuccess: state.userReducer.loginSuccess,
  }
}
export default connect(mapStateToProps)(UserDetails)