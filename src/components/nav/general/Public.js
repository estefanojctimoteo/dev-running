import React, { Component } from 'react'
import { connect } from 'react-redux'
import Home from './Home'

class Public extends Component {    
    constructor(props) {
        super(props)
        this.state = {
            fromLoginOrRegister: 
              (this.props.match.params.fromLoginOrRegister ? 
               parseInt(this.props.match.params.fromLoginOrRegister,10) : 0)
        }
    }
    render(){
    const { loggedUser_name } = this.props
    const { fromLoginOrRegister } = this.state
    return (
      <Home fromLoginOrRegister={fromLoginOrRegister} loggedUser_name={loggedUser_name} />
    )
  }
}
const mapStateToProps = (state) => {
  return {
    loggedUser_name: state.userReducer.loggedUser_name
  }
}
export default connect(mapStateToProps)(Public)