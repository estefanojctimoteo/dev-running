import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Drawer from '@material-ui/core/Drawer'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'

import {default as uuid} from 'node-uuid'

import { flatButtonStyle } from './Styles'

import { openProfileRequest,
         incrementWaitingTime,
         setIsCountingWaitingTime,
         userAuthenticatedByTokenFound, 
         setModalObj } from './redux/actions'

import LoginLogout from './components/nav/general/LoginLogout'
import Register from './components/nav/users/Register'
import UserDetails from './components/nav/users/UserDetails'

import {
  NavLink,
  Redirect
} from "react-router-dom"

import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import Card from '@material-ui/core/Card'
import pict from './picts/logo.png'

import Person from '@material-ui/icons/Person'
import People from '@material-ui/icons/People'
import HomeIcon from '@material-ui/icons/Home'
import DirectionsRun from '@material-ui/icons/DirectionsRun'

import LinearProgress from '@material-ui/core/LinearProgress'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  list: {
    width: 250,
  },
  card: {
    backgroundColor: '#eeeeee',
    maxWidth: 250,
    display: 'flex',
    justifyContent: 'center',    
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },  
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },  
})

class MenuAppBar extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      left: false,    
      localIsFetching: this.props.isFetchingR || this.props.isFetchingU || 
                       this.props.isFetchingAllUsers || this.props.isFetchingAllUsersLike ||
                       this.props.isFetchingST,
    }
    this.dispatchSetModalObj = this.dispatchSetModalObj.bind(this)    
  }
  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    })
  }
  componentWillReceiveProps(nextProps){
    if (this.props.isCountingWaitingTime && this.props.waitingTime===3 && nextProps.waitingTime>3){
      this.dispatchSetModalObj()
    }
    if (!this.props.isCountingWaitingTime && !this.state.localIsFetching &&
        (nextProps.isFetchingR || nextProps.isFetchingU || nextProps.isFetchingAllUsers || 
         nextProps.isFetchingST || nextProps.isFetchingAllUsersLike)){
      this.setTimer()
      this.props.setIsCountingWaitingTime(true)
      this.setState({ 
        ...this.state, 
        localIsFetching: true 
      })
    } else
    if (this.props.isCountingWaitingTime && this.state.localIsFetching &&    
        !nextProps.isFetchingR && !nextProps.isFetchingU && !nextProps.isFetchingAllUsers && 
        !nextProps.isFetchingST && !nextProps.isFetchingAllUsersLike){
      this.setState({ 
        ...this.state, 
        localIsFetching: false 
      })
      this.props.setIsCountingWaitingTime(false)
      if (this.timeout) {
        clearTimeout(this.timeout)
      }            
    }
  }
  setTimer() {
    this.timeout = setTimeout(this.updateClock.bind(this), 1000)
  }  
  updateClock() {
    this.props.incrementWaitingTime()
    this.setState(this.getTime, this.setTimer)  
  }  
  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }    
  dispatchSetModalObj(){
    this.props.setModalObj({      
      id: uuid.v4(),
      type: 'keepWaiting',
      text1: '',
      text2: 'The API is taking to long to respond...',
      text3: '',
      component: 'ConfirmationDialog',      
      onClose: () => console.log("fire at closing event"),
      onConfirm: () => console.log("fire at confirming event"),
    })
  }  
  render() {
    let { classes, authenticated, role } = this.props 
    let { localIsFetching } = this.state
    const sideList = (
      <div className={classes.list}>
        <div>        
          <Card className={classes.card} onClick={this.handleClose}>
             <img src={pict} alt="Run!" />
          </Card>
        </div>
        <NavLink to="/" style={{ textDecoration:'none'}} >
          <MenuItem onClick={this.handleClose}>
            <HomeIcon color="primary" data-tip="Home" />&nbsp;&nbsp;&nbsp;
            Home
          </MenuItem>
        </NavLink>
        <NavLink to="/usersList" style={{ textDecoration:'none'}} >          
          <MenuItem onClick={this.handleClose}>            
            {role==='user' &&
              <Person color="primary" data-tip="My Profile" />}
            {role==='admin' &&
              <People color="primary" data-tip="Users" />}
            &nbsp;&nbsp;&nbsp;
            {role==='admin'?'Users':'My Profile'}
          </MenuItem>
        </NavLink>
        <NavLink to="/runsList" style={{ textDecoration:'none'}} >
          <MenuItem onClick={this.handleClose}>
            <DirectionsRun color="primary" data-tip="Runs" />&nbsp;&nbsp;&nbsp;
            {role==='admin'?'Runs':'My Runs'}
          </MenuItem>
        </NavLink>
      </div>
    )
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            {authenticated && (
              <div>              
                <IconButton
                  style={{display: (!authenticated ? 'none' : 'block')}}
                  onClick={this.toggleDrawer('left', true)}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
                  <div
                    tabIndex={0}
                    role="button"
                    onClick={this.toggleDrawer('left', false)}
                    onKeyDown={this.toggleDrawer('left', false)}
                  >
                  {sideList}
                  </div>
                </Drawer>                
              </div>
            )}

            <Typography variant="title" color="inherit" className={classes.flex}>
              Runs Manager
            </Typography>

            <NavLink to="/simpleTest" style={{ textDecoration:'none', display: (!authenticated ? 'block' : 'none')}} >
              <Button style={flatButtonStyle} >
                API Test
              </Button>
            </NavLink>

            <Register authenticated={authenticated}/>
            <UserDetails authenticated={authenticated}/>            
            <LoginLogout authenticated={authenticated}/>
          </Toolbar>
        </AppBar>
        { localIsFetching ? <LinearProgress color='primary' /> : <LinearProgress variant="determinate" value={100} /> }
        {this.props.openMyProfile &&
          <div>          
            <Redirect
              to={{
                pathname: "/myprofile",
                state: { from: this.props.location }
              }}
            />
          </div>
        }
        <ReactTooltip place="top" type="dark" effect="float" multiline/>        
      </div>
    )
  }
}
MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => {
  return {
    openMyProfile: state.userReducer.openMyProfile,
    isFetchingR: state.runReducer.isFetching,
    isFetchingU: state.userReducer.isFetching,
    isFetchingST: state.simpleTestReducer.isFetching,
    isFetchingAllUsers: state.userReducer.isFetchingAllUsers,
    isFetchingAllUsersLike: state.userReducer.isFetchingAllUsersLike,
    isCountingWaitingTime: state.modalReducer.isCountingWaitingTime,
    waitingTime: state.modalReducer.waitingTime,  
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    userAuthenticatedByTokenFound: ( token ) => dispatch(userAuthenticatedByTokenFound( token )),
    openProfileRequest: () => dispatch(openProfileRequest()),
    incrementWaitingTime: () => dispatch(incrementWaitingTime()),
    setIsCountingWaitingTime: (value) => dispatch(setIsCountingWaitingTime(value)),
    setModalObj: ( obj ) => dispatch(setModalObj( obj )),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MenuAppBar))