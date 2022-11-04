import React from "react";
import { HashRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom";
import Routes from "./routes";
// import { LocaleProvider } from "antd-mobile";
import App from './app'

ReactDOM.render(
  // <LocaleProvider locale={enUS}>
  <App />

  // </LocaleProvider>
  ,
  document.getElementById("root")
);
