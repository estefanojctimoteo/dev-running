import React, { Component } from 'react'
import RunPage from '../../../forms/RunPage'
import { connect } from 'react-redux'

class OpenRun extends Component {
  render() {    
    return (this.props.runId > 0 || this.props.creatingRunFromList) ? 
             <RunPage runId={this.props.runId} /> : <div></div>
  }  
}
const mapStateToProps = (state) => {
  return {
    creatingRunFromList: state.runReducer.creatingRunFromList
  }
} 
export default connect(mapStateToProps)(OpenRun)