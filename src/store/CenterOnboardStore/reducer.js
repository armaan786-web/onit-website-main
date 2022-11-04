import { SET_LOGIN_DETAILS, SET_LOGOUT_DETAILS } from "./type";

const initialState = {
  centerOnboardDetails: {

  },
  userTokens: {
    accessToken: '',
  },
  isCenterOnboardLoggedIn: false,


};

// Creating my reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN_DETAILS:
      return { ...action.payload };
    case SET_LOGOUT_DETAILS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
