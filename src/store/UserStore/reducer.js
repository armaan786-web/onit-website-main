import { SET_LOGIN_DETAILS, SET_LOGOUT_DETAILS, SET_UPDATED_USER_DETAILS } from "./type";

const initialState = {
  userDetails: {

  },
  userTokens: {
    accessToken: '',
  },
  isUserLoggedIn: false,
  centerDetailsPopulated : {}

};

// Creating my reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN_DETAILS:
      return { ...state, ...action.payload };
    case SET_LOGOUT_DETAILS:
      return { ...state, ...action.payload };
    case SET_UPDATED_USER_DETAILS:
      return { ...state, userDetails: action.payload };
    default:
      return state;
  }
}
