import React, { Component } from 'react'
import RunsList from '../../lists/RunsList'
import { userRunsSelectedInList } from '../../redux/actions'
import { connect } from 'react-redux'

class MyRuns extends Component {    
  componentWillMount(){
    if (this.props.loggedUser_id !== this.props.idUserRunSelected){
      this.props.userRunsSelectedInList(this.props.loggedUser_id)
    }
  }
  render(){
    const { loggedUser_id, idUserRunSelected } = this.props
    return (
      <div>
        {loggedUser_id > 0 && loggedUser_id===idUserRunSelected &&
          <RunsList />                
        }
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    loggedUser_id: state.userReducer.loggedUser_id,
    idUserRunSelected: state.runReducer.idUserRunSelected
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    userRunsSelectedInList: ( idUserRunSelected ) => dispatch(userRunsSelectedInList( idUserRunSelected )),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyRuns)