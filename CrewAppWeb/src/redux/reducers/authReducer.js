import {
    USER_SUCCESS,
    USER_LOADING,
    USER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    LOGIN_LOADING,
    CLEAR_ERROR,
  } from '../types/authTypes'
  import Cookies from "js-cookie"
  
  const initialState = {
    token: Cookies.get('crew-control-token') || '',
    isAuth: !!Cookies.get('crew-control-token'), // This should initialize isAuth based on token presence
    user: null,
    error: null,
    isUserLoading: true,
    isLoginLoading: false
  }
  
  export default function authReducer(state = initialState, action) {
    switch (action.type) {
      case USER_LOADING:
        return {
          ...state,
          isUserLoading: true,
          isAuth: false,
          error: null
        }
      case LOGIN_LOADING:
        return {
          ...state,
          isLoginLoading: true,
          error: null
        }
      case USER_SUCCESS:
        return {
          ...state,
          isAuth: true,
          user: action.payload.user,
          isUserLoading: false,
          error: null
        }
      case LOGIN_SUCCESS:
        Cookies.set('crew-control-token', action.payload.token, { expires: 7 })
        return {
          ...state,
          user: action.payload.user,
          isAuth: true,
          token: action.payload.token,
          isLoginLoading: false,
          error: null
        }
      case USER_FAIL:
      case LOGIN_FAIL:
      case LOGOUT:
        return {
          ...state,
          token: null,
          user: null,
          isAuth: false,
          isLoginLoading: false,
          isUserLoading: false,
          error: action.payload || null
        }
      case CLEAR_ERROR:
        return {
          ...state,
          error: null
        }
      default:
        return {
          ...state
        }
    }
  }