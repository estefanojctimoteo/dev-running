import React, { Component } from 'react'

import pict from '../../../picts/logo-home.png'

import ReactTooltip from 'react-tooltip'

import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'

import PropTypes from 'prop-types'

const styles = theme => ({
  paper: {
    padding: 1,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  greeting: {
    fontFamily: "Roboto",
    fontWeight: "400",
    color: 'primary'
  }
})

class Home extends Component {
  render() {
    const { classes } = this.props
    const { fromLoginOrRegister, loggedUser_name } = this.props
    return (
      <Paper className={classes.paper} elevation={0}>
        {fromLoginOrRegister === 2 &&
          <h3 className={classes.greeting}>Thanks for coming! See you!</h3>
        }
        {fromLoginOrRegister === 1 &&
          <h3 className={classes.greeting}>Welcome{loggedUser_name !== '' && ' ' + loggedUser_name}!</h3>
        }
        {(fromLoginOrRegister === undefined || fromLoginOrRegister === 0) &&
          <h3>&nbsp;</h3>
        }        
        <img width="23%" src={pict} alt="Run!" data-tip="Run!" />
        <ReactTooltip place="top" type="dark" effect="float" />
      </Paper>
    )
  }
}
Home.propTypes = {
  classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(Home)