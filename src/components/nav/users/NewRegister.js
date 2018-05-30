import React, { Component } from 'react'
import RegisterPage from '../../../forms/RegisterPage'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import PropTypes from 'prop-types'

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },  
})

class NewRegister extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: -1
    }
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
              <RegisterPage userId={userId} fromNewRegister={true} />           
            </Paper>
          </Grid>
          <Grid item xs={2}>
          </Grid>
        </Grid>
      )
  } 
}
NewRegister.propTypes = {
  classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(NewRegister)