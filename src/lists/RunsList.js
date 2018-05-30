import React, { Component } from "react"
import { connect } from 'react-redux'
import { getRunsRequest, 
         getRunsByUserIdRequest,
         setRunsListUnitOption } from '../redux/actions'

import Grid from '@material-ui/core/Grid'

import RunsTable from './RunsTable'
import OpenRun from '../components/nav/runs/OpenRun'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import { Redirect } from "react-router-dom"

import PropTypes from 'prop-types'

import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    marginLeft: 5
  },
  formControl:{
    marginTop: '150px'
  },
  label:{
    color: 'rgba(0, 0, 0, 0.54)'
  }
})

class RunsList extends Component {
  constructor(props){
    super(props)

    this.state = {
      runId: -1,
      dataAllRuns: [],      
    }
    this.handleChange = this.handleChange.bind(this)
  }
  componentWillMount(){
    if (!this.props.authenticated) {
      this.props.history.push('/loginPage')
    } else {
      if (this.props.idUserRunSelected > 0){
        console.log('opa!!')
          this.props.getRunsByUserIdRequest(this.props.idUserRunSelected, this.props.unitOption)
      } else {
        this.props.getRunsRequest(this.props.unitOption)
      }
    } 
  }
  componentWillReceiveProps(nextProps){
    if (!this.props.allRunsLoaded && nextProps.allRunsLoaded){
      this.setState({ 
        ...this.state, 
        dataAllRuns: this.props.dataAllRuns
      })          
    } else
    if ((this.props.idRunSelected <= 0 && nextProps.idRunSelected > 0)                        
               ||
        (this.props.creatingRunFromList)) {
      this.setState({ 
        ...this.state, 
        runId: nextProps.idRunSelected 
      })
    } else
    if (this.props.idUserRunSelected > 0 && nextProps.idUserRunSelected < 0){
      this.props.getRunsRequest(this.props.unitOption)
    } else
    if (this.props.idUserRunSelected !== nextProps.idUserRunSelected && nextProps.idUserRunSelected > 0){
      this.props.getRunsByUserIdRequest(nextProps.idUserRunSelected, this.props.unitOption)
    }
  }
  handleChange = event => {
    this.props.setRunsListUnitOption(event.target.value, this.props.idUserRunSelected)
  }
  render() {
    const { allRunsLoaded, classes, unitOption } = this.props
    return (
      <Grid container direction="row" >
        {this.props.isFetchingAllUsers &&
          <Redirect
             to={{
               pathname: "/usersList",
               state: { from: this.props.location }
             }}
          />
        }                  
        <Grid item xs={1}>        
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel className={classes.label} component="legend"
            >Unit option</FormLabel>
            <RadioGroup
              aria-label="unitOption"
              name="unitOption"
              className={classes.group}
              value={unitOption}
              onChange={this.handleChange}
            >
              <FormControlLabel className={classes.label} value="metric" control={<Radio />} label="Metric" />
              <FormControlLabel className={classes.label} value="imperial" control={<Radio />} label="Imperial" />
              <FormControlLabel className={classes.label} value="both" control={<Radio />} label="Both" />
            </RadioGroup>
          </FormControl>          
        </Grid>
        <Grid item xs={8}>
          {allRunsLoaded && 
            <RunsTable dataAllRuns={this.props.dataAllRuns} />          
          }
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper} elevation={0}>
            <OpenRun runId={this.props.idRunSelected} />
          </Paper>
        </Grid>
      </Grid> 
    )
  }
}
RunsList.propTypes = {
  classes: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => {
  return {
    authenticated: state.userReducer.authenticated,
    error: state.runReducer.error,
    isFetching: state.runReducer.isFetching,
    isFetchingAllUsers: state.userReducer.isFetchingAllUsers,
    dataAllRuns: state.runReducer.dataAllRuns,
    allRunsLoaded: state.runReducer.allRunsLoaded,
    idRunSelected: state.runReducer.idRunSelected,
    idUserRunSelected: state.runReducer.idUserRunSelected,
    creatingRunFromList: state.userReducer.creatingRunFromList,
    unitOption: state.runReducer.runsListUnitOption
  } 
}
const mapDispatchToProps = (dispatch) => {
  return {
    getRunsRequest: (runsListUnitOption) => dispatch(getRunsRequest(runsListUnitOption)),
    getRunsByUserIdRequest: (userId, runsListUnitOption) => 
      dispatch(getRunsByUserIdRequest(userId, runsListUnitOption)),
    setRunsListUnitOption: (runsListUnitOption, idUserRunSelected) => 
      dispatch(setRunsListUnitOption(runsListUnitOption, idUserRunSelected)),    
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RunsList))