import { USER_LOGIN_REQUEST,
         USER_LOGIN_SUCCESS,
         ERROR_USER_MESSAGE,
         USER_LOGOUT_REQUEST,

         USER_AUTHENTICATED_BY_TOKEN_FOUND,

         CREATE_USER_REQUEST,
         UPDATE_USER_REQUEST,
         UPDATE_USER_SUCCESS,

         DELETE_USER_REQUEST,

         GET_ALL_USERS_REQUEST,
         GET_ALL_USERS_SUCCESS,
         GET_ALL_USERS_ERROR,

         GET_USER_BY_ID_REQUEST, 
         GET_USER_BY_ID_SUCCESS,

         GET_USERS_BY_NAME_LIKE_REQUEST,
         GET_USERS_BY_NAME_LIKE_SUCCESS,

         GET_NAME_USER_RUNS_SUCESS,

         USER_SELECTED_IN_LIST, 

         CREATE_USER_ERROR,

         GET_TIMEZONES_REQUEST,
         GET_TIMEZONES_SUCCESS,

         OPEN_PROFILE_REQUEST,
         OPEN_PROFILE_SUCCESS,

         DONT_WANNA_WAIT,

         } from '../types/userActionTypes'

export const userLoginRequest = (email, passwd, keepmeloggedin) => {
    return {
        type: USER_LOGIN_REQUEST,            
        email,
        passwd,
        keepmeloggedin 
    }
}
export const userLoginSuccess = (id, name, email, role, unit, timezone, keepmeloggedin) => {
    return {
        type: USER_LOGIN_SUCCESS,
        id: id,
        name: name,
        email: email,
        role: role,
        unit: unit,
        timezone: timezone,
        keepmeloggedin: keepmeloggedin
    }
}
export const errorMessageToUser = (errorUserMessage) => {
    return {
        type: ERROR_USER_MESSAGE,
        errorUserMessage
    }
}
export const userLogoutRequest = () => {
    return {
        type: USER_LOGOUT_REQUEST
    }
}
export const userAuthenticatedByTokenFound = (token) => {
    return {
        type: USER_AUTHENTICATED_BY_TOKEN_FOUND,
        token
    }
}

export const createUserRequest = ( name, email, passwd, role, unit, timezone, fromList ) => {
    return {
        type: CREATE_USER_REQUEST,
        name, email, passwd, role, unit, timezone, fromList
    }
}
export const createUserError = ( errorUserMessage ) => {
    return {
        type: CREATE_USER_ERROR,
        errorUserMessage
    }
}


export const updateUserRequest = ( id, name, email, passwd, role, unit, timezone, me, fromList ) => {
    return {
        type: UPDATE_USER_REQUEST,
        id, name, email, passwd, role, unit, timezone, me, fromList 
    }
}
export const updateUserSuccess = (dataRegUser) => { 
    return {
        type: UPDATE_USER_SUCCESS,
        dataRegUser
    }
}


export const deleteUserRequest = ( id ) => {
    return {
        type: DELETE_USER_REQUEST,
        id
    }
}


export const getAllUsersRequest = () => {
    return {
        type: GET_ALL_USERS_REQUEST
    }
}
export const getAllUsersSuccess = (dataAllUsers) => {
    return {
        type: GET_ALL_USERS_SUCCESS,
        dataAllUsers
    }
}
export const getAllUsersError = (data) => {
    return {
        type: GET_ALL_USERS_ERROR,
        data
    }
}


export const getAllUsersByNameLikeRequest = (name) => {
  return {
    type: GET_USERS_BY_NAME_LIKE_REQUEST,
    name
  }
}
export const getAllUsersByNameLikeSuccess = (dataAllUsersLike) => {
  return {
    type: GET_USERS_BY_NAME_LIKE_SUCCESS,
    dataAllUsersLike
  }
}

export const getUserByIdRequest = ( id, me ) => {
  return {
      type: GET_USER_BY_ID_REQUEST,
      id,
      me
  }
}
export const getUserByIdSuccess = ( dataRegUser ) => {
  return {
    type: GET_USER_BY_ID_SUCCESS,
    dataRegUser
  }
}
export const getNameUserRunsSuccess = ( userName ) => {
  return {
    type: GET_NAME_USER_RUNS_SUCESS,
    userName
  }
}
export const userSelectedInList = ( idUserSelected ) => {
  return {
    type: USER_SELECTED_IN_LIST,
    idUserSelected
  }
} 
export const dontWannaWaitU = () => {
    return {
      type: DONT_WANNA_WAIT,      
    }
  }
export const getTimezonesRequest = () => {
  return {
    type: GET_TIMEZONES_REQUEST
  }
}  
export const getTimezonesSuccess = (data) => {
  return {
    type: GET_TIMEZONES_SUCCESS,
    data
  }
}
export const openProfileRequest = () => {
  return {
    type: OPEN_PROFILE_REQUEST
  }
}
export const openProfileSuccess = () => {
  return {
    type: OPEN_PROFILE_SUCCESS
  }
}