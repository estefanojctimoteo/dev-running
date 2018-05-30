import React, { Component } from "react"

import ReactTable from "react-table"
import "react-table/react-table.css"

import matchSorter from 'match-sorter'

import {default as uuid} from 'node-uuid'

import { setModalObj,
         deleteRunRequest, 
         runSelectedInList, 
         userRunsSelectedInList,
         resetUserRunsSelectedInList,
         getAllUsersByNameLikeRequest } from '../redux/actions'

import { connect } from 'react-redux'

import ReactTooltip from 'react-tooltip'

import { withAlert } from 'react-alert'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'

import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import ClearIcon from '@material-ui/icons/Clear'
import TransferIcon from '@material-ui/icons/TransferWithinAStation'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    marginLeft: -5,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },  
  dialog: {
    width: '80%',
    maxHeight: 435,
  },  
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },  
})

class RunsTable extends Component {
  constructor(props) {
    super(props)

    this.dispatchSetModalObj = this.dispatchSetModalObj.bind(this)
    this.dispatchRunSelected = this.dispatchRunSelected.bind(this)
    this.dispatchDeleteRun = this.dispatchDeleteRun.bind(this)
    this.dispatchResetUserRunsSelectedInList = this.dispatchResetUserRunsSelectedInList.bind(this)
    this.handleOpenDialog = this.handleOpenDialog.bind(this)
    this.handleCloseDialog = this.handleCloseDialog.bind(this)

    this.state = {
      value: this.props.nameUserRunsSelectedInList,
      userId: -1,
      openDialog: false,      
    }
  }
  handleOpenDialog(){
    this.setState({ 
      ...this.state, 
      openDialog: true })
  }
  handleCloseDialog = value => {
    this.setState({
      ...this.state, 
      value, 
      openDialog: false });
  }  
  dispatchResetUserRunsSelectedInList(){
    this.props.resetUserRunsSelectedInList()
  }
  dispatchRunSelected(id){   
    this.props.runSelectedInList(id===-2 ? id : id.value)
  }
  dispatchSetModalObj(){
    this.props.setModalObj({      
      id: uuid.v4(),
      type: 'selectUser',
      text: 'Are you sure to do this?',
      component: 'ConfirmationDialog'
    })
  }
  dispatchDeleteRun(id){
    confirmAlert({
      title: 'Confirm to delete:',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.props.deleteRunRequest(id.value)
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
      this.props.alert.error(nextProps.errorRunMessage)
    }    
  }
  render() {
    const { classes, dataAllRuns, idUserRunSelected, loggedUser_id, loggedUser_role, nameUserRunsSelectedInList } = this.props    
    return (
      <div>
        <h2>
          { loggedUser_role==='admin' && nameUserRunsSelectedInList!=='' && 
            <a className="menu_links"
              onMouseOver={()=>{}} style={{cursor: 'pointer'}}>                    
              <i onClick={this.dispatchSetModalObj}>
                <Tooltip id="tooltip-bottom" title="Select User" placement="top">
                  <TransferIcon mini='true' color='primary' style={{ fontSize: 18}} />
                </Tooltip>&nbsp;&nbsp;
              </i> 
              <i onClick={()=> this.dispatchResetUserRunsSelectedInList()}>
                <Tooltip id="tooltip-bottom" title="All Users" placement="top">
                  <ClearIcon mini='true' color="primary" style={{ fontSize: 12}} />
                </Tooltip>
              </i> 
            </a>
          }
          { loggedUser_role==='admin' && nameUserRunsSelectedInList==='' && 
            <a className="menu_links"
              onMouseOver={()=>{}} style={{cursor: 'pointer'}}>                    
              <i onClick={this.dispatchSetModalObj}>
                <Tooltip id="tooltip-bottom" title="Select User" placement="top">
                  <TransferIcon mini='true' color='primary' style={{ fontSize: 18}} />
                </Tooltip>&nbsp;&nbsp;
              </i> 
            </a>                        
          }
          {nameUserRunsSelectedInList!==undefined && nameUserRunsSelectedInList!=='' && nameUserRunsSelectedInList+' - '}
          {nameUserRunsSelectedInList==='' && ((idUserRunSelected === loggedUser_id) || loggedUser_role==='user') && 'My '}Runs&nbsp;&nbsp;&nbsp;&nbsp;
          { ((idUserRunSelected === loggedUser_id) || loggedUser_role==='user') &&
            <Button variant="fab" mini color="primary" 
              aria-label="add" className={classes.button} data-tip="New Run"            
              onClick={()=> this.dispatchRunSelected(-2)}> 
              <AddIcon />
            </Button>
          }
        </h2>
        <ReactTable
          data={dataAllRuns}
          filterable
          defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}          
          columns={[
            {
              columns: [
                {
                  Header: "User Name",
                  maxWidth: 160,
                  accessor: "name",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["name"] }),
                  filterAll: true
                },
                {
                  Header: "Run Friendly Name",
                  maxWidth: 150,
                  accessor: "friendly_name",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["friendly_name"] }),
                  filterAll: true
                },
                {
                  Header: "Created",
                  maxWidth: 150,                  
                  accessor: "created",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["created"] }),
                  filterAll: true
                },
                {
                  Header: "Timezone",
                  maxWidth: 180,                  
                  accessor: "timezone",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["timezone"] }),
                  filterAll: true
                },
                {
                  Header: "Duration",
                  maxWidth: 75,                  
                  accessor: "duration",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["duration"] }),
                  filterAll: true
                },
                {
                  Header: "Distance",
                  accessor: "distance",
                  maxWidth: 75,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["distance"] }),
                  filterAll: true
                },
                {
                  Header: "",
                  maxWidth: 45,                  
                  accessor: "unit",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["unit"] }),
                  filterAll: true
                },
                {
                  maxWidth: 35,
                  accessor: "id",
                  filterable: false,
                  Cell: ({ value }) => 
                    (<a className="menu_links" 
                       onMouseOver={()=>{}} style={{cursor: 'pointer'}}>                    
                       <i onClick={()=> this.dispatchRunSelected({value})}> 
                         <EditIcon color="primary" data-tip="Edit" />
                       </i>
                     </a>)
              },
                {
                  maxWidth: 35,
                  filterable: false,
                  accessor: "id",
                  Cell: ({ value }) => 
                    (<a className="menu_links" 
                       onMouseOver={()=>{}} style={{cursor: 'pointer'}}>                    
                       <i onClick={()=> this.dispatchDeleteRun({value})}>
                         <DeleteIcon color="primary" data-tip="Delete" />
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
    idUserRunSelected: state.runReducer.idUserRunSelected,
    loggedUser_id: state.userReducer.loggedUser_id,
    loggedUser_role: state.userReducer.loggedUser_role,
    nameUserRunsSelectedInList: state.userReducer.nameUserRunsSelectedInList,
    error: state.runReducer.error,
    errorRunMessage: state.runReducer.errorRunMessage,
    dataAllUsersLike: state.userReducer.dataAllUsersLike,
    isFetchingAllUsersLike: state.userReducer.isFetchingAllUsersLike,    
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setModalObj: ( obj ) => dispatch(setModalObj( obj )),
    runSelectedInList: ( idRunSelected ) => dispatch(runSelectedInList( idRunSelected )),
    deleteRunRequest: ( id ) => dispatch(deleteRunRequest( id )),
    resetUserRunsSelectedInList: () => dispatch(resetUserRunsSelectedInList()),
    getAllUsersByNameLikeRequest: (name) => dispatch(getAllUsersByNameLikeRequest(name)),
    userRunsSelectedInList: ( idUserRunSelected, me ) => dispatch(userRunsSelectedInList( idUserRunSelected, me )),    
  }
}
export default withAlert(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RunsTable)))