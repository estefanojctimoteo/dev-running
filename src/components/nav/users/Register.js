import React, { Component } from 'react'
import { NavLink } from "react-router-dom"
import { getTimezonesRequest } from '../../../redux/actions'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { flatButtonStyle } from '../../../Styles'

class Register extends Component {
  componentDidMount(){
    if (typeof this.props.timezones === 'undefined' || this.props.timezones.length === 0){
      this.props.getTimezonesRequest()
    }
  }
  render(){
    const { authenticated } = this.props    
    return (
      <NavLink to={!authenticated ? "/register" : "/public"} style={{ textDecoration:'none', display: (!authenticated ? 'block' : 'none')}} >
        <Button style={flatButtonStyle} >
          Register
        </Button>
      </NavLink> 
    )   
  }
} 
const mapStateToProps = (state) => {
  return {
      timezones: state.userReducer.timezones
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getTimezonesRequest: () => dispatch(getTimezonesRequest())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Register)