import React from 'react';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './index.css';
import App from './App';
import reducer from './state/reducer';
import epics from './state/epics';

const rootEpic = combineEpics(...epics);

const epicMiddleware = createEpicMiddleware(rootEpic)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(
  applyMiddleware(epicMiddleware)
));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
