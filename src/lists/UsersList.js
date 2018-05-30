import React, { Component } from "react"
import { connect } from 'react-redux'
import { getAllUsersRequest } from '../redux/actions'

import Grid from '@material-ui/core/Grid'

import UsersTable from './UsersTable'
import OpenProfile from '../components/nav/users/OpenProfile'

import { Redirect } from "react-router-dom"

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import PropTypes from 'prop-types'

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    marginLeft: 5
  },  
})

class UsersList extends Component {
  constructor(props){
    super(props)

    this.state = {
      data: [],
      doRedirect: false
    }
  }
  componentWillMount(){
    if (!this.props.authenticated) {
      this.props.history.push('/loginPage')
    }
    else if (this.props.loggedUser_role!=='admin'){
      this.props.history.push('/myprofile')
    } else {
      this.props.getAllUsersRequest()
    }
  }  
  componentWillReceiveProps(nextProps){    
    if (!this.props.allUsersLoaded && nextProps.allUsersLoaded){
      this.setState({ 
        ...this.state, 
        data: this.props.dataAllUsers
      })          
    } else
    if ((this.props.idUserSelected <= 0 && nextProps.idUserSelected > 0)                        
               ||
        (this.props.creatingUserFromList)) {
      this.setState({ userId: nextProps.idUserSelected })
    } else
    if (this.props.idUserRunSelected !== nextProps.idUserRunSelected){
      this.setState({ doRedirect: true })
    }
  }  
  render() {
    const { allUsersLoaded, classes } = this.props
    return (
       <Grid container direction="row" >        
        <Grid item xs={7}> 
          {allUsersLoaded &&
            <UsersTable data={this.props.data} />          
          }
        </Grid>
        <Grid item xs={5}> 
          <Paper className={classes.paper} elevation={0}>
            <OpenProfile userId={this.props.idUserSelected} /> 
          </Paper>
        </Grid>
        {this.state.doRedirect &&
          <div>          
            <Redirect
              to={{
                pathname: "/runsList",
                state: { from: this.props.location }
              }}
            />
          </div>
        }              
       </Grid> 
    )
  }
}
UsersList.propTypes = {
  classes: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => {
  return {
    authenticated: state.userReducer.authenticated,
    error: state.userReducer.error,
    isFetching: state.userReducer.isFetching,
    data: state.userReducer.dataAllUsers,
    allUsersLoaded: state.userReducer.allUsersLoaded,
    idUserSelected: state.userReducer.idUserSelected,
    idUserRunSelected: state.runReducer.idUserRunSelected,
    loggedUser_role: state.userReducer.loggedUser_role,
    creatingUserFromList: state.userReducer.creatingUserFromList,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getAllUsersRequest: () => dispatch(getAllUsersRequest())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UsersList))