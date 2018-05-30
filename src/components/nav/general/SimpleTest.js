import React, { Component } from 'react'
import { loadSimpleTestDataRequest } from '../../../redux/actions'
import { connect } from 'react-redux'
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

class SimpleTest extends Component {
  constructor (props){
    super(props)
    this.state={
      showButton: true,
    }
    this.hideButton = this.hideButton.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  hideButton(btn){
    this.refs.btn.style={display: 'none'}
  }
  handleClick(){
    this.props.loadData()
    this.setState({ ...this.state, showButton: false })
  }
  render(){
    const { classes } = this.props
    return (
      <Grid container direction="row" >        
        <Grid item xs={4}>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper} elevation={0}>
            Click to test the consumption of the API: {!this.state.showButton && this.props.data}&nbsp;&nbsp;
            {this.state.showButton && !this.props.isFetching && <button 
                onClick={this.handleClick}>Click</button>}
            {this.props.isFetching && <span>loading...</span>}
            {this.props.error && <span>): Error!...</span>}
          </Paper>
        </Grid>
        <Grid item xs={2}>
        </Grid>
      </Grid>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    isFetching: state.simpleTestReducer.isFetching,
    data: state.simpleTestReducer.data,
    error: state.simpleTestReducer.error
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    loadData: () => dispatch(loadSimpleTestDataRequest())
  }
}
SimpleTest.propTypes = {
  classes: PropTypes.object.isRequired,
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SimpleTest))