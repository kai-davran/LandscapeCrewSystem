import {
    USER_SUCCESS,
    USER_LOADING,
    USER_FAIL,
    LOGOUT,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGIN_LOADING,
    CLEAR_ERROR,
} from "../types/authTypes"
import {ERRORS} from "../../constants/errors"
import Cookies from 'js-cookie';
  
const _baseApi = process.env.REACT_APP_BASE_API1;

export const loadUser = () => async (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) {
        dispatch(userFail('No token found'));
        return;
    }
    
    dispatch(userLoading());
  
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        }
    }
  
    try {
        const response = await fetch(`${_baseApi}/tenants/get-me/`, options);
        const data = await response.json();

        if (response.ok) {
            dispatch(userSuccess(data));
        } else {
            Cookies.remove('crew-control-token', { path: '/' });  // 🛠 Remove the expired token
            dispatch(userFail('Unauthorized'));
        }
    } catch (e) {
        Cookies.remove('crew-control-token', { path: '/' });  // 🛠 Remove on network errors too
        dispatch(userFail('Network error'));
    }
}

export const login = (email, password) => async (dispatch, getState) => {
    dispatch(loginLoading());
    
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password })
        }

        const response = await fetch(`${_baseApi}/tenants/login/`, options)
        const data = await response.json()

        if (response.ok) {
            Cookies.set('crew-control-token', data.token, { expires: 7, path: '/' });
            dispatch(loginSuccess(data.data[0], data.token));
            await dispatch(loadUser());  // 🛠 Load user info after login
            // No manual redirect here!
        } else {
            dispatch(loginFail(data?.detail[0] || ERRORS.LOGIN_FAIL_ERROR));
        }
    } catch (e) {
        dispatch(loginFail(ERRORS.NETWORK_OR_SYNTAX_ERROR));
    }
}
  
export const loginLoading = () => ({ type: LOGIN_LOADING })
export const loginSuccess = (user, token) => ({ type: LOGIN_SUCCESS, payload: {user, token} })
export const loginFail = error => ({ type: LOGIN_FAIL, payload: error })

export const userLoading = () => ({ type: USER_LOADING })
export const userSuccess = (user, token) => ({ type: USER_SUCCESS, payload: {user, token} })
export const userFail = error => ({ type: USER_FAIL, payload: error })

export const logout = () => {
    Cookies.remove('crew-control-token', { path: '/' });
    return { type: LOGOUT };
};

export const clearError = () => ({ type: CLEAR_ERROR })