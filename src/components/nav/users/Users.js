import React, { Component } from 'react'
import { Link } from "react-router-dom"

class Users extends Component {    
  render(){
    const { authenticated, role } = this.props
    return (
      <Link to={authenticated && role==="admin" ? "/usersList" : "/loginPage"} >
               {authenticated && role==="admin" ? 'Users' : '' }
      </Link>
    )
  }
}
export default Users