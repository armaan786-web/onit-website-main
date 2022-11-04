import React, { useEffect } from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

const AdminPrivate = ({ component: Component, restricted, ...rest }) => {

    const globalState = useSelector((state) => state.AdminReducer)
    const history = useHistory();
    useEffect(() => {
        if (globalState?.isAdminLoggedIn) {
            history.push('/admin-dashboard')
        }
    }, [])

    return (
        <Route {...rest} render={props => (
            <Component {...props} />
        )} />
    );
};

export default AdminPrivate;
