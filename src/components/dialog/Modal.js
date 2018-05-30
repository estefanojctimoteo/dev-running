import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { dontWannaWaitR,
         dontWannaWaitU,
         dontWannaWaitST,
         userRunsSelectedInList,
         getAllUsersByNameLikeRequest,
         setIsCountingWaitingTime, } from '../../redux/actions'

import ReactTable from "react-table"
import "react-table/react-table.css"
import matchSorter from 'match-sorter'

import ForwardIcon from '@material-ui/icons/Forward'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { withStyles } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { createMuiTheme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#7986CB',
      main: '#4394db', 
      dark: '#4394db',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#999999',
      main: '#10234f',
      dark: '#1f1311',
      contrastText: '#eecf8f',
    },
    appBar: {
      color: 'primary'
    },
  },
})

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },  
})

class Modal extends Component {
  constructor(props, context) {
    super(props, context)

    this.state={
      searchValue: '',
      mainValue: '',
      showData: false
    }
    
    this.handleChange = this.handleChange.bind(this)    
    this.handleSearch = this.handleSearch.bind(this)
    this.dispatchDontWait = this.dispatchDontWait.bind(this)
    this.dispatchIWillWait = this.dispatchIWillWait.bind(this)
    this.dispatchUserRunsSelectedInList = this.dispatchUserRunsSelectedInList.bind(this)
  }  

  state = {}

  textField = null
  dispatchDontWait(){
    this.props.setIsCountingWaitingTime(false)
    this.props.dontWannaWaitU()
    this.props.dontWannaWaitR()
    this.props.dontWannaWaitST()
    this.onClose()
  }
  dispatchIWillWait(){
    this.props.setIsCountingWaitingTime(true)
    this.onClose()
  }
  dispatchUserRunsSelectedInList(id){
    if (String(id.value)!==''){
      this.setState({
        ...this.state,
        mainValue: String(id.value)
      })
      this.props.userRunsSelectedInList(id.value, (parseInt(id.value, 10) === this.props.loggedUser_id))      
      this.onConfirm()
    }
  }  
  onClose(){
    if(this.props.item.onClose){
      this.props.item.onClose()
      this.props.onClose(this.props.item)
    } else {
      this.props.onClose(this.props.item)
    }
  }
  onConfirm(){
    if(this.props.item.onConfirm){
      this.props.item.onConfirm();
      this.props.onClose(this.props.item)
    } else {
      this.onClose()
    }
  }
  handleChange = name => event => {
    this.setState({
      ...this.state,
      [name]: event.target.value,
    })
  }      
  handleSearch(){
    if (this.state.searchValue !== ''){
      this.props.getAllUsersByNameLikeRequest(this.state.searchValue)
    }
  }
  componentWillReceiveProps(nextProps){
    if (this.props.item.type === 'keepWaiting' && this.props.isCountingWaitingTime && !nextProps.isCountingWaitingTime){
      this.onClose()
    }    
  }
  render() {
    const { classes } = this.props
    const { type } = this.props.item

    if (type === 'selectUser') {
      const { component } = this.props.item
      return (
        <div className="modal-wrapper">
          <div className="modal">
            {component==='ConfirmationDialog' &&
              <MuiThemeProvider theme={theme}>
                <Dialog disableBackdropClick disableEscapeKeyDown
                  maxWidth="xs" aria-labelledby="confirmation-dialog-title" 
                  open={this.state.mainValue===''}
                  classes={{
                   paper: classes.dialog,
                  }} >
                  <DialogTitle id="confirmation-dialog-title">Select User</DialogTitle>
                  <DialogContent>
                    <FormControl component="fieldset" >
                      <FormGroup>
                        <div>
                          <TextField onChange={this.handleChange('searchValue')} />
                        </div>
                        <br />
                        <div>
                          <button onClick={this.handleSearch} style={{ width: '70px' }} >Search</button>
                        </div>
                      </FormGroup>
                    </FormControl>
                    <ReactTable
                      data={this.props.dataAllUsersLike}
                      filterable
                      defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
                      columns={[
                        {
                          columns: [
                            {
                              maxWidth: 35,
                              accessor: "id",
                              filterable: false,
                              Cell: ({ value }) =>
                                (<a className="menu_links"
                                  onMouseOver={() => { }} style={{ cursor: 'pointer' }}>
                                  <i onClick={() => this.dispatchUserRunsSelectedInList({ value })}>
                                    <ForwardIcon color="primary" data-tip="Select" />
                                  </i>
                                </a>)
                            },
                            {
                              Header: "Name",
                              maxWidth: 280,
                              accessor: "name",
                              filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["name"] }),
                              filterAll: true
                            },
                          ]
                        }
                      ]}
                      defaultPageSize={5}
                      className="-striped -highlight"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button className="modal-button" onClick={() => this.onClose()} color='primary'>
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </MuiThemeProvider>
            }    
          </div>
        </div>
      )
    } else if (type === 'keepWaiting') {
      const { text1, text2, text3 } = this.props.item;
      const { component } = this.props.item
      return (
        <div className="modal-wrapper">
          <div className="modal">
            {component==='ConfirmationDialog' &&
              <MuiThemeProvider theme={theme}>
                <Dialog disableBackdropClick disableEscapeKeyDown
                  maxWidth="xs" aria-labelledby="confirmation-dialog-title" 
                  open={this.state.mainValue===''}
                  classes={{
                   paper: classes.dialog,
                  }} >
                  <DialogContent>
                     <div className="modaltext">{text1}</div>
                     <div className="modaltext">{text2}</div>
                     <div className="modaltext">{text3}</div>
                  </DialogContent>
                  <DialogActions>
                    <Button className="modal-button" onClick={() => this.dispatchIWillWait()} color='primary'>
                      Wait
                    </Button>
                    <Button className="modal-button" onClick={() => this.dispatchDontWait()} color='primary'>
                      Leave
                    </Button>
                  </DialogActions>
                </Dialog>
              </MuiThemeProvider>
            }    
          </div>
        </div>
      )
    } else if (type === 'custom') {
      const { content } = this.props.item
      return (
        <div className="modal-wrapper">
          <div className="modal">
            <button className="close" onClick={() => this.onClose()}>&times;</button>
            {content}
          </div>
        </div>
      )
    }
    return (
        <div></div>
    )
  }
}
Modal.propTypes = {
  classes: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => {
  return {
    idUserRunSelected: state.runReducer.idUserRunSelected,
    loggedUser_id: state.userReducer.loggedUser_id,
    dataAllUsersLike: state.userReducer.dataAllUsersLike,
    isCountingWaitingTime: state.modalReducer.isCountingWaitingTime,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    dontWannaWaitU: () => dispatch(dontWannaWaitU()),
    dontWannaWaitR: () => dispatch(dontWannaWaitR()),
    dontWannaWaitST: () => dispatch(dontWannaWaitST()),
    getAllUsersByNameLikeRequest: (name) => dispatch(getAllUsersByNameLikeRequest(name)),
    userRunsSelectedInList: ( idUserRunSelected, me ) => dispatch(userRunsSelectedInList( idUserRunSelected, me )),    
    setIsCountingWaitingTime: (value) => dispatch(setIsCountingWaitingTime(value)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Modal))