import React, { Component } from 'react'
import decode from 'jwt-decode'

import { connect } from 'react-redux'

import { openProfileSuccess } from '../../../redux/actions'
import RegisterPage from '../../../forms/RegisterPage'

import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import PropTypes from 'prop-types'

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },  
})

class MyProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: -1
    }
  }    
  componentWillMount() {
    const token = localStorage.getItem("user")    
    if ( token ) {
      let decoded = decode(token)
      this.setState({ userId: decoded.id })
    } else {
      this.props.history.push('/loginPage')
    }
    this.props.openProfileSuccess()
  }
  render() {
    const { classes } = this.props
    const { userId } = this.state
      return (    
        <Grid container direction="row" >        
          <Grid item xs={4}>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={0}>
              <RegisterPage userId={userId} fromMyProfile={true} />            
            </Paper>
          </Grid>
          <Grid item xs={2}>
          </Grid>
        </Grid>
      )
  } 
}
MyProfile.propTypes = {
  classes: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => {
  return {
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    openProfileSuccess: () => dispatch(openProfileSuccess())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MyProfile))