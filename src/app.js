import React from "react";
import { HashRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom";
import Routes from "./routes";
/**
 * redux imports
 */

import { wrapper } from './store/store'
import { useStore } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import setAuthToken from './helper/setAuthToken';

import './app.css'


const App = () => {

    const store = useStore((state) => state)
    /**
       * redux setup
       * theme provider
       * context api
       *
       */
    setAuthToken(store)

    return process.browser ? (
        <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
            <Router>
                <Routes />
            </Router>
        </PersistGate>
    ) : (
        <PersistGate persistor={store}>
            <Router>
                <Routes />
            </Router>
        </PersistGate>
    )
}

export default wrapper.withRedux(App)
