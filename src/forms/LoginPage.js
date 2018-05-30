import React, { Component } from 'react'

import { Redirect } from "react-router-dom"
import { connect } from 'react-redux'

import { userLoginRequest } from '../redux/actions'

import { withAlert } from 'react-alert'

import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
  },
  button: {
    margin: theme.spacing.unit,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },    
  missing: {
    margin: theme.spacing.unit,
    color: 'Red',
  }
})

class LoginPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      passwd: '',
      keepmeloggedin: 'on',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleChangeChk = this.handleChangeChk.bind(this)
  }
  handleChange = name => event => {
    this.setState({
      ...this.state,
      [name]: event.target.value,
    })
  }
  handleChangeChk = name => event => {
    this.setState({ [name]: event.target.checked });
  }
  handleLogin() {
    const { email, passwd, keepmeloggedin } = this.state
    this.props.userLoginRequest(email, passwd, keepmeloggedin === "on")
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.error && nextProps.error) {
      this.props.alert.error('Error: ' + nextProps.errorUserMessage + '   :(')
    }
  }
  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleLogin()
    }
  }
  render() {
    const { classes } = this.props
    return (
      <div> 
        <Paper className={classes.paper} elevation={0}>
        <form>
          <FormControl component="fieldset" >
            <FormGroup>
              <h2>Sign In</h2>
              <div>
                <TextField required id="email" label="email" className={classes.textField}
                  value={this.state.email} onChange={this.handleChange('email')}
                  margin="normal" autoComplete="email" onKeyPress={this.handleKeyPress} />
              </div>

              <div>
                <TextField required id="passwd" label="Password" type="password"
                  className={classes.textField} onKeyPress={this.handleKeyPress}
                  value={this.state.passwd} onChange={this.handleChange('passwd')}
                  margin="normal" autoComplete="passwd" />
              </div>

              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.keepmeloggedin}
                      onChange={this.handleChangeChk('keepmeloggedin')}
                      value="keepmeloggedin" color="primary"
                    />
                  }
                  label='Keep Me Logged In'
                />
              </div>

              <div>
                <Button variant="raised" color="primary" className={classes.button} onClick={this.handleLogin}>
                  Sign In
                </Button>
              </div>

            </FormGroup>
          </FormControl>
        </form>
        </Paper>

        {this.props.loginOk && !this.props.error && this.props.authenticated &&
          <Redirect
            to={{ pathname: "/public/1", state: { from: this.props.location } }}
          />
        }
      </div>
    )
  }
}
LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => {
  return {
    data: state.userReducer.data,
    error: state.userReducer.error,
    loginOk: state.userReducer.loginOk,
    errorUserMessage: state.userReducer.errorUserMessage,
    isFetching: state.userReducer.isFetching,
    authenticated: state.userReducer.authenticated
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    userLoginRequest: (email, passwd, keepmeloggedin) => dispatch(userLoginRequest(email, passwd, keepmeloggedin))
  }
}
export default withAlert(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LoginPage)))