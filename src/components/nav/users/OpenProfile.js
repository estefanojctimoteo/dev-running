import React, { Component } from 'react'
import RegisterPage from '../../../forms/RegisterPage'
import { connect } from 'react-redux'

class OpenProfile extends Component {
  render() {    
    return (this.props.userId > 0 || this.props.creatingUserFromList) ?
             <RegisterPage userId={this.props.userId} /> : <div></div>
  }
}
const mapStateToProps = (state) => {
  return {
    creatingUserFromList: state.userReducer.creatingUserFromList
  }
}
export default connect(mapStateToProps)(OpenProfile)