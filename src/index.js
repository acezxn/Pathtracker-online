import React from 'react';
import { HashRouter, json } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { Helmet } from 'react-helmet';
import jsonToCssVariables from 'json-to-css-variables';
import colorData from './theme.json';
import './css/index.css';
import './css/ui_specific.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const options = {
  element: ":root",
  pretty: true
};
const css_string = jsonToCssVariables(colorData, options);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Helmet>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="apple-touch-icon" sizes="180x180" href={require("./icons/apple-touch-icon.png")}></link>
      <link rel="icon" type="image/png" sizes="32x32" href={require("./icons/favicon-32x32.png")}></link>
      <link rel="icon" type="image/png" sizes="16x16" href={require("./icons/favicon-16x16.png")}></link>
      <style>{css_string}</style>
      <title>Pathtracker Online</title>
    </Helmet>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
