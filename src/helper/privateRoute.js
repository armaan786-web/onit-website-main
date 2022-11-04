import React, { useEffect } from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const history = useHistory();

    const globalState = useSelector((state) => state.userReducer)

    console.log(globalState, "global state")


    useEffect(() => {
        if (!globalState?.isUserLoggedIn) {
            history.push('/')
        }
    }, [])

    return (

        <Route {...rest} render={props => (
            <Component  {...props } />
        )} />
    );
};

export default PrivateRoute;
