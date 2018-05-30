import React, { Component } from "react"

import ReactTable from "react-table"
import "react-table/react-table.css"

import matchSorter from 'match-sorter'

import { deleteUserRequest, 
         userSelectedInList,
         userRunsSelectedInList } from '../redux/actions'

import { connect } from 'react-redux'

import ReactTooltip from 'react-tooltip' 

import { withAlert } from 'react-alert'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import DirectionsRun from '@material-ui/icons/DirectionsRun'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    marginLeft: -5,
  },
})

class UsersTable extends Component {
  constructor(props) {
    super(props)

    this.dispatchUserSelected = this.dispatchUserSelected.bind(this)
    this.dispatchDeleteUser = this.dispatchDeleteUser.bind(this)

    this.state = {
      userId: -1
    }
  }
  dispatchUserSelected(id){
    this.props.userSelectedInList(id===-2 ? id : id.value)
  }
  dispatchUserRunsSelected(id){
    this.props.userRunsSelectedInList(id.value, (parseInt(id.value, 10) === this.props.loggedUser_id))
  }
  dispatchDeleteUser(id){
    confirmAlert({
      title: 'Confirm to delete:',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.props.deleteUserRequest(id.value)            
          }
        },
        {
          label: 'No',
          onClick: () => {            
          }
        }
      ]
    })    
  }
  componentWillReceiveProps(nextProps){
    if (!this.props.error && nextProps.error) {
      this.props.alert.error(nextProps.errorUserMessage)
    }    
  }
  render() {
    const { data } = this.props
    const { classes } = this.props
    return (
      <div>
        <h2>Users&nbsp;&nbsp;&nbsp;&nbsp;<Button variant="fab" mini color="primary" 
            aria-label="add" className={classes.button} data-tip="Create User"            
            onClick={()=> this.dispatchUserSelected(-2)}>
            <AddIcon />
          </Button>
        </h2>
        <ReactTable
          data={data}
          filterable
          defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}          
          columns={[
            {
              columns: [
                {
                  Header: "Name",
                  maxWidth: 160,
                  accessor: "name",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["name"] }),
                  filterAll: true
                },
                {
                  Header: "Email",
                  maxWidth: 210,                  
                  accessor: "email",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["email"] }),
                  filterAll: true
                },
                {
                  Header: "Timezone",
                  maxWidth: 230,                  
                  accessor: "timezone",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["timezone"] }),
                  filterAll: true
                },
                {
                  Header: "Role",
                  accessor: "role",
                  maxWidth: 60,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["role"] }),
                  filterAll: true
                },
                {
                  maxWidth: 35,
                  accessor: "id",
                  filterable: false,
                  Cell: ({ value }) => 
                    (<a className="menu_links" 
                       onMouseOver={()=>{}}
                       style={{cursor: 'pointer'}}>                    
                       <i onClick={()=> this.dispatchUserSelected({value})}> 
                       <EditIcon color="primary" data-tip="Edit" /></i>
                    </a>)
                },
                {
                  maxWidth: 35,
                  filterable: false,
                  accessor: "id",
                  Cell: ({ value }) => 
                    (<a className="menu_links" 
                      onMouseOver={()=>{}}
                      style={{cursor: 'pointer'}}>                    
                      <i onClick={()=> this.dispatchDeleteUser({value})}>
                      <DeleteIcon color="primary" data-tip="Delete" />
                      </i> 
                    </a>)
                },
                {
                  maxWidth: 35,
                  filterable: false,
                  accessor: "id",
                  Cell: ({ value }) => 
                    (<a className="menu_links" 
                       onMouseOver={()=>{}}
                       style={{cursor: 'pointer'}}>                    
                       <i onClick={()=> this.dispatchUserRunsSelected({value})}>
                       <DirectionsRun color="primary" data-tip="Runs" />
                       </i>
                     </a>)                        
                },
              ]
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
        />
        <br />
        <ReactTooltip place="top" type="dark" effect="float"/>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    error: state.userReducer.error,
    errorUserMessage: state.userReducer.errorUserMessage,
    loggedUser_id: state.userReducer.loggedUser_id,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    userSelectedInList: ( idUserSelected ) => dispatch(userSelectedInList( idUserSelected )),
    userRunsSelectedInList: ( idUserRunSelected, me ) => dispatch(userRunsSelectedInList( idUserRunSelected, me )),
    deleteUserRequest: ( id ) => dispatch(deleteUserRequest( id ))
  }
}
export default withAlert(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UsersTable)))