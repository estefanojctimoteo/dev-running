import React, { Component } from 'react'
import { connect } from 'react-redux'

import { createRunRequest,
         updateRunRequest,
         getRunByIdRequest } from '../redux/actions'

import { isObject, isArray } from 'util'
import { withAlert } from 'react-alert'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

import NumberFormat from 'react-number-format'
import MaskedInput from 'react-text-mask'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
  },
  button: {
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    maxWidth: 160,
  },
});

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      ref={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[/[0-2]/, /\d/, ':', /[0-5]/, /\d/, ':', /[0-5]/, /\d/]}      
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
}

class RunPage extends Component { 
    constructor(props) {
        super(props)

        this.state = {
            dataRegRun: [],
            runId: (props.runId && props.runId > 0 ? props.runId : -1),

            friendly_name: '',
            duration: '',
            distance: '',
            created: '',
            unit: this.props.loggedUser_unit,
            timezone: this.props.loggedUser_timezone,
            
            submitted: false,
            regRunLoaded: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.clearForm = this.clearForm.bind(this)
    }
    componentWillMount(){
      const { runId } = this.state
      try{
          if (runId && runId > 0){
            this.props.getRunByIdRequest(parseInt(runId,10))
          }
      }
      catch (e) {
      }      
    }
    componentWillReceiveProps(nextProps){
      if (!this.props.error && nextProps.error) {
        this.props.alert.error('Error: ' + nextProps.errorRunMessage + '   :(')
      } else {
        const { runId } = this.state
        if ((runId && runId > 0 && !this.props.regRunLoaded && nextProps.regRunLoaded)
                                   ||
            (!nextProps.creatingRunFromList && !this.props.regRunLoaded && nextProps.regRunLoaded)){
          if (isArray(nextProps.dataRegRun)){
            let dataRegRun = Object.assign({}, nextProps.dataRegRun)
            this.setState({
              ...this.state,
              runId: dataRegRun[0].id,
              friendly_name: dataRegRun[0].friendly_name,
              duration: dataRegRun[0].duration,
              created: (dataRegRun[0].created).replace(' ','T'),
              distance: dataRegRun[0].distance,
              unit: dataRegRun[0].unit,
              timezone: dataRegRun[0].timezone
            })
          } else
          if (isObject(nextProps.dataRegRun)){
            let dataRegRun = Object.assign({}, nextProps.dataRegRun)
            this.setState({
              ...this.state,
              runId: dataRegRun.id,
              friendly_name: dataRegRun.friendly_name,
              duration: dataRegRun.duration,
              created: (dataRegRun.created).replace(' ','T'),
              distance: dataRegRun.distance,
              unit: dataRegRun.unit,
              timezone: dataRegRun.timezone
            })
          }
        } else
        if (nextProps.creatingRunFromList){
          this.setState({
            ...this.state,
            runId: -1
          })
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
    clearForm(){
      this.setState({
        ...this.state,

        friendly_name: '',
        duration: '',             
        distance: '',
        created: '',
        unit: this.props.loggedUser_unit,
        timezone: this.props.loggedUser_timezone,
        submitted: false,
      })
    }
    handleSubmit(event) {      
      let { runId } = this.state
      try{
        runId = parseInt(runId,10)
      } catch (e) {
      }
      let reg_friendly_name = this.state.friendly_name
      let reg_duration = this.state.duration
      let reg_created = this.state.created
      let reg_timezone = this.state.timezone
      let reg_distance = this.state.distance
    
      this.setState({ 
        ...this.state, 
        submitted: true 
      })
    
      if (reg_friendly_name && reg_duration && reg_distance) {
        if (runId > 0){ //update
          this.props.updateRunRequest(runId, 
            reg_friendly_name, reg_duration, reg_created, reg_timezone, reg_distance,
            this.props.fromList) 
        }
        else { // insert
          this.props.createRunRequest(reg_friendly_name, reg_duration, reg_distance, this.props.idUserRunSelected) 
        }
      }
    }        
    render() {
      const { classes } = this.props
      let { friendly_name, duration, created, distance, submitted } = this.state
      const labelUnit = "distance (" + (this.state.unit==='metric'?'km':'mi') + ")"
      return (           
        <div>
          <form>
            <FormControl component="fieldset" >
              <FormGroup>
                <h2>{this.props.creatingRunFromList ? "New Run" : "Run"}</h2>
                
                <div>
                  <TextField required id="friendly_name" label="friendly_name" 
                    className={classes.textField}
                    value={friendly_name} onChange={this.handleChange('friendly_name')}
                    margin="normal" autoComplete="friendly_name" />
                  {submitted && !friendly_name &&
                    <div className="help-block">Friendly Name is required</div>
                  }
                </div>

                <FormControl  className={classes.formControl}>
                  <InputLabel 
                    margin='dense' required
                    htmlFor="duration">Duration (hh:mm:ss)</InputLabel>
                  <Input                    
                    value={duration} required
                    onChange={this.handleChange('duration')}
                    id="duration" margin='dense'
                    inputComponent={TextMaskCustom}
                  />

                  {submitted && !duration &&
                    <div className="help-block">Duration is required</div>
                  }
                </FormControl>

                <div>
                  <TextField
                    required className={classes.formControl}
                    label={labelUnit} value={distance}
                    onChange={this.handleChange('distance')}
                    id="distance" margin="normal" autoComplete="distance"
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                  />
                  {submitted && !distance &&
                    <div className="help-block">Distance is required</div>
                  }
                </div>                

                <div>
                  <TextField id="created" label="created" disabled={!this.props.regRunLoaded}
                    className={classes.textField} type={this.props.regRunLoaded?"datetime-local":"text"}
                    value={created} onChange={this.handleChange('created')}
                    margin="normal" autoComplete="created" />
                </div>

              </FormGroup>
            </FormControl>
          </form>
          <div>
            <Button type="submit" variant="raised" color="primary" className={classes.button} onClick={this.handleSubmit}>              
              {this.props.creatingRunFromList ? "Insert" : "Update"}
            </Button>
          </div>          
        </div> 
      )
    }
}
RunPage.propTypes = {
  classes: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => {
    return {
        isFetching: state.runReducer.isFetching,
        error: state.runReducer.error,
        fromList: state.runReducer.fromList,
        errorRunMessage: state.runReducer.errorRunMessage,        
        dataRegRun: state.runReducer.dataRegRun,
        regRunLoaded: state.runReducer.regRunLoaded,
        loggedUser_id: state.userReducer.loggedUser_id,
        loggedUser_role: state.userReducer.loggedUser_role,
        loggedUser_unit: state.userReducer.loggedUser_unit,
        loggedUser_timezone: state.userReducer.loggedUser_timezone,
        creatingRunFromList: state.runReducer.creatingRunFromList,
        idUserRunSelected: state.runReducer.idUserRunSelected,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createRunRequest: ( friendly_name, duration, distance, fromList ) => 
          dispatch(createRunRequest( friendly_name, duration, distance, fromList )),

        updateRunRequest: ( id, friendly_name, duration, created, timezone, distance, fromList ) => 
          dispatch(updateRunRequest( id, friendly_name, duration, created, timezone, distance, fromList )),

        getRunByIdRequest: ( id ) => dispatch(getRunByIdRequest( id ))        
    }
}
export default withAlert(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RunPage)))