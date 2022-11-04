import React, { useEffect } from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

const PublicRoute = ({ component: Component, restricted, ...rest }) => {

    const globalState = useSelector((state) => state.userReducer)
    const history = useHistory();
    useEffect(() => {
        if (globalState?.isUserLoggedIn) {
            history.push('/center-dashboard')
        }
    }, [])

    return (
        <Route {...rest} render={props => (
            <Component {...props} />
        )} />
    );
};

export default PublicRoute;
