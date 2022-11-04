import { SET_LOGIN_DETAILS, SET_LOGOUT_DETAILS} from "./type";

export const setLoginDetails = (payload) => (dispatch) => {
  return dispatch({
    type: SET_LOGIN_DETAILS,
    payload: payload,
  });
};

export const setLogoutDetails = (payload) => (dispatch) => {
  return dispatch({
    type: SET_LOGOUT_DETAILS,
    payload: payload,
  });
};




