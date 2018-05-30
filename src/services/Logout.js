import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom"
import { userLogoutRequest } from '../redux/actions'

class Logout extends Component {
  componentWillMount() {
    this.props.userLogoutRequest()
  }
  render() {
    return (
      <div>
        {!this.props.authenticated &&
          <Redirect
            to={{
              pathname: "/public/2",
              state: { from: this.props.location }
            }}
          />
        }
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    authenticated: state.userReducer.authenticated
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    userLogoutRequest: () => dispatch(userLogoutRequest())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Logout)