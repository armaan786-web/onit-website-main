import axios from 'axios';
import { useSelector } from 'react-redux'
import { setLoginDetails as UserSetLoginDetails } from '../store/UserStore/action';
import { setLoginDetails as AdminSetLoginDetails } from '../store/AdminStore/action';
import { setLoginDetails as CenterOnboardSetLoginDetails } from '../store/CenterOnboardStore/action';


function axiosInterceptor(props, adminState, centerOnboardState) {
  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      console.log({ axiosInterceptorError: error });
      const err = error.response?.data?.message;

      console.log({ axiosError: err });

      if (err?.includes('jwt expired') || err?.includes('Permission denied') || err?.includes('User not found') || err?.includes('Token is invalid')) {

        console.log('adminState is', adminState)
        if (adminState?.adminDetails?.user_name) {
          props.dispatch(
            AdminSetLoginDetails({
              adminDetails: {},
              isAdminLoggedIn: false,
              userTokens: {
                accessToken: ""
              },
            })
          )
          // history.push("/admin-login")
          window.location.replace("http://onit.fit/#/admin-login");
        } else if (centerOnboardState?.centerOnboardDetails?.name) {
          props.dispatch(
            CenterOnboardSetLoginDetails({
              centerOnboardDetails: {},
              isCenterOnboardLoggedIn: false,
              userTokens: {
                accessToken: ""
              },
            })
          )
          // history.push("/admin-login")
          window.location.replace("http://onit.fit/#/admin-login");
        } else {
          props.dispatch(
            UserSetLoginDetails({
              userDetails: {},
              isUserLoggedIn: false,
              userTokens: {
                accessToken: "",
              },
            }),
          )
          // history.push("/login")
          window.location.replace("http://onit.fit/#/login");

        }
      }

      return Promise.reject(error);
    }
  );
}

const SetAuthToken = (props) => {

  const globalState = useSelector((state) => state.userReducer)
  const adminState = useSelector((state) => state.AdminReducer)
  const centerOnboardState = useSelector((state) => state.centerOnboardReducer)

  axiosInterceptor(props, adminState, centerOnboardState);

  /* apply to every requests */
  if (adminState.isAdminLoggedIn) {
    axios.defaults.headers.common['x-access-token'] = adminState?.userTokens?.accessToken;

  } else if (centerOnboardState?.isCenterOnboardLoggedIn) {
    axios.defaults.headers.common['x-access-token'] = globalState?.userTokens?.accessToken;

  } else {
    axios.defaults.headers.common['x-access-token'] = globalState?.userTokens?.accessToken;

  }

};

export default SetAuthToken;
