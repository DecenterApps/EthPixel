import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers/index';

let store = null;

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

if (process.env === 'development') {
  const reduxDevToolsEnchancer = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(); // eslint-disable-line
  store = createStoreWithMiddleware(reducers, reduxDevToolsEnchancer);
} else {
  store = createStoreWithMiddleware(reducers);
}

const storeExport = store;

export default storeExport;
