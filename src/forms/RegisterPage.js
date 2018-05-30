import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom"

import { createUserRequest, 
         updateUserRequest,
         getUserByIdRequest,
         getTimezonesRequest } from '../redux/actions'

import { isNull, isObject, isArray } from 'util'
import { withAlert } from 'react-alert'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'

import MenuItem from '@material-ui/core/MenuItem'
import SelectWrapped from '../components/SelectWrapped'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  formControl_: {
    margin: theme.spacing.unit,
    minWidth: 490,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  missing: {
    margin: theme.spacing.unit,
    color: 'Red',
  },
})

class RegisterPage extends Component {
  constructor(props) { 
        super(props)

    this.state = {
      dataRegUser: [],
      id: (props.userId && props.userId > 0 ? props.userId : -1),

      name: '',
      email: '', 
      role: '',             
      unit: '', 
      passwd: '',
      timezone: '',

      submitted: false,      
    } 

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.clearForm = this.clearForm.bind(this)
    this.handleChangeSL = this.handleChangeSL.bind(this)
    this.handleChangeSLT = this.handleChangeSLT.bind(this)
  }
  componentWillMount(){
    const { id } = this.state
    try {
      if (id && id > 0) {
        this.props.getUserByIdRequest(parseInt(id, 10), (parseInt(id, 10) === this.props.loggedUser_id)) 
      }
    } catch (e) {
    }
  }
  componentDidMount(){
    if (this.props.loggedUser_id===-1 || this.props.timezones===undefined || this.props.timezones.length === 0){
      this.props.getTimezonesRequest()
    }
  }
  componentWillReceiveProps(nextProps){
    if (!this.props.error && nextProps.error) {
      this.props.alert.error('Error: ' + nextProps.errorUserMessage + '   :(')
    } else {
      const { id } = this.state
      if ((id && id > 0 && !this.props.regUserLoaded && nextProps.regUserLoaded)
                                     ||
          (!nextProps.creatingUserFromList && !this.props.regUserLoaded && nextProps.regUserLoaded)){
        if (isArray(nextProps.dataRegUser)){
          let dataRegUser = Object.assign({}, nextProps.dataRegUser)
          this.setState({ 
            ...this.state,
            name: dataRegUser[0].name,
            email: dataRegUser[0].email,
            timezone: dataRegUser[0].timezone,
            role: isNull(dataRegUser[0].role) || (dataRegUser[0].role!=="user"&&dataRegUser[0].role!=="admin")?"user":dataRegUser[0].role,
            unit: isNull(dataRegUser[0].unit) || (dataRegUser[0].unit!=="metric"&&dataRegUser[0].unit!=="imperial")?"metric":dataRegUser[0].unit
          })
        } else
        if (isObject(nextProps.dataRegUser)){
          let dataRegUser = Object.assign({}, nextProps.dataRegUser)
          this.setState({ 
            ...this.state,
            name: dataRegUser.name,
            email: dataRegUser.email,
            timezone: dataRegUser.timezone,
            role: isNull(dataRegUser.role) || (dataRegUser.role!=="user"&&dataRegUser.role!=="admin")?"user":dataRegUser.role,
            unit: isNull(dataRegUser.unit) || (dataRegUser.unit!=="metric"&&dataRegUser.unit!=="imperial")?"metric":dataRegUser.unit
          })
        }
      } else
      if (nextProps.creatingUserFromList){
        this.clearForm()
      } else
      if (!this.props.updateSuccess && nextProps.updateSuccess) {
        this.props.alert.success('Success!')
      }
    }
  }
  handleChange = name => event => {
    this.setState({
      ...this.state,
      [name]: event.target.value,
    })
  }    
  handleChangeSL = event => {
    this.setState({ [event.target.name]: event.target.value })
  }
  handleChangeSLT = name => value => {
    this.setState({
      ...this.state,
      [name]: value,
    })
  }   
  clearForm(){
    this.setState({
      ...this.state,
      name: '',
      email: '', 
      role: '',             
      unit: '', 
      passwd: '',
      timezone: '',
      submitted: false,
    })
  }
  handleSubmit(event) {
    const { id } = this.state
    let userId = -1
    try{
      userId = parseInt(id,10)
    } catch (e) {
    }

    let reg_name = this.state.name
    let reg_email = this.state.email
    let reg_passwd = this.state.passwd
    let reg_timezone = this.state.timezone
    let reg_role = this.state.role !== '' ? this.state.role : 'user'
    let reg_unit = this.state.unit !== '' ? this.state.unit : 'metric'

    this.setState({ 
      ...this.state, 
      submitted: true 
    })

    if (reg_name && reg_email && reg_passwd && reg_role && reg_unit && reg_timezone) {      
      if (userId > 0){ //update
        this.props.updateUserRequest(userId, 
            reg_name, reg_email, reg_passwd, reg_role, reg_unit, reg_timezone,
            (userId===this.props.loggedUser_id),
            this.props.fromList)  
      }
      else { // insert        
        this.props.createUserRequest(reg_name, reg_email, reg_passwd, reg_role, reg_unit, reg_timezone, this.props.fromList)
      }
    }
  }
  render() {
    const { classes } = this.props
    let { name, email, passwd, role, unit, timezone, submitted } = this.state
    
    role = (role===''?'user':role)
    unit = (unit===''?'metric':unit)

    const { timezones } = this.props
    let lstTimezones = []
    if (timezones!==undefined){
      lstTimezones = 
        timezones.map(tmz => 
         ({ value:tmz.id,
           label:tmz.timezone + ' (' + tmz.id + ')' 
         }))
    }
    return ( 
      <div>
        <form>
          <FormControl component="fieldset" >
            <FormGroup>
              <h2>{this.props.creatingUserFromList || this.state.id === -1 ? "New User" :
                (this.props.userId === this.props.loggedUser_id ? "My " : "") + "Profile"}</h2>

              <div>
                <TextField required id="name" label="Name" className={classes.textField}
                  value={name} onChange={this.handleChange('name')}
                  margin="normal" autoComplete="name" />
                {submitted && !name &&
                  <div className={classes.missing}>Name is required</div>
                }
              </div>

              <div>
                <TextField required id="email" label="Email" className={classes.textField}
                  value={email} onChange={this.handleChange('email')} margin="normal"
                  autoComplete="email"
                  disabled={(this.state.id && this.state.id > 0) ? true : false} />
                {submitted && !email &&
                  <div className={classes.missing}>Email is required</div>
                }
              </div>

              <div>
                <TextField required id="passwd" label="Password" type="password"
                  className={classes.textField} autoComplete="current-password"
                  value={passwd} onChange={this.handleChange('passwd')}
                  margin="normal" />
                {submitted && !passwd &&
                  <div className={classes.missing}>Password is required</div>
                }
              </div>

              <div>
                <FormControl className={classes.formControl_}>
                  <TextField                    
                    fullWidth
                    id="timezone"
                    value={timezone}
                    onChange={this.handleChangeSLT('timezone')}
                    placeholder="Timezone *"
                    name="timezone"
                    label=""
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputComponent: SelectWrapped,
                      inputProps: {
                        classes,
                        multi: false,
                        instanceId: 'timezone',
                        id: 'timezone',
                        simpleValue: true,
                        options: lstTimezones                       
                      },
                    }}
                  />
                </FormControl>
                {submitted && timezone === '' &&
                  <div className={classes.missing}>Timezone is required</div>
                }
              </div>

              <div>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="role">Role</InputLabel>
                  <Select
                    value={role}
                    onChange={this.handleChangeSL}
                    inputProps={{
                      name: 'role',
                      id: 'role',
                    }}
                  >
                    <MenuItem key='user' value='user'>User</MenuItem>
                    {this.props.loggedUser_role === "admin" &&
                      <MenuItem key='admin' value='admin'>Admin</MenuItem>
                    }
                  </Select>
                </FormControl>
                {submitted && !role &&
                  <div className={classes.missing}>The role is required</div>
                }
              </div>

              <div>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="unit">Unit</InputLabel>
                  <Select
                    value={unit}
                    onChange={this.handleChangeSL}
                    inputProps={{
                      name: 'unit',
                      id: 'unit',
                    }}
                  >
                    <MenuItem key='metric' value='metric'>Metric</MenuItem>
                    <MenuItem key='imperial' value='imperial'>Imperial</MenuItem>
                  </Select>
                </FormControl>
                {submitted && !unit &&
                  <div className={classes.missing}>The unit is required</div>
                }
              </div>

              <div>
                <Button variant="raised" color="primary" className={classes.button} onClick={this.handleSubmit}>
                  {this.props.userId === undefined || this.props.userId <= 0 ? "Insert" : "Update"}
                </Button>
              </div>
    
            </FormGroup>
          </FormControl>
        </form>
        {this.props.fromNewRegister && this.props.loggedUser_id > 0 &&
          <Redirect
            to={{
              pathname: "/public/1",
              state: { from: this.props.location }
            }}
          />
        } 
        {!this.props.fromMyProfile && !this.props.fromNewRegister && this.props.loggedUser_id > 0 && this.props.loggedUser_role !== 'admin' &&
          <Redirect
             to={{
               pathname: "/myprofile",
               state: { from: this.props.location }
             }}
          />
        }
      </div>
    )
  }
}
RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => {
  return {
    updateSuccess: state.userReducer.updateSuccess,
    isFetching: state.userReducer.isFetching,
    error: state.userReducer.error,
    fromList: state.userReducer.fromList,
    errorUserMessage: state.userReducer.errorUserMessage,        
    dataRegUser: state.userReducer.dataRegUser,
    regUserLoaded: state.userReducer.regUserLoaded,
    loggedUser_id: state.userReducer.loggedUser_id,
    loggedUser_role: state.userReducer.loggedUser_role, 
    creatingUserFromList: state.userReducer.creatingUserFromList,
    timezones: state.userReducer.timezones
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    createUserRequest: ( name, email, passwd, role, unit, timezone, fromList ) => 
      dispatch(createUserRequest( name, email, passwd, role, unit, timezone, fromList )),

    updateUserRequest: ( id, name, email, passwd, role, unit, timezone, me, fromList ) => 
      dispatch(updateUserRequest( id, name, email, passwd, role, unit, timezone, me, fromList )),

    getUserByIdRequest: ( id, me ) => dispatch(getUserByIdRequest( id, me )),
    getTimezonesRequest: () => dispatch(getTimezonesRequest())
  }
}
export default withAlert(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RegisterPage)))