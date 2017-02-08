/**
 * Bulgur store configuration
 * ===================================
 * Configuring store with appropriate middlewares
 */
import {applyMiddleware, createStore, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import promiseMiddleware from './promiseMiddleware';
import {persistentStore} from 'redux-pouchdb';

const PouchDB = require('pouchdb');
const db = new PouchDB('bulgur');

/**
 * Configures store with a possible inherited state and appropriate reducers
 * @param initialState - the state to use to bootstrap the reducer
 * @return {object} store - the configured store
 */
export default function configureStore (initialState = {}) {
  // Compose final middleware with thunk and promises handling
  const middleware = applyMiddleware(
    thunk,
    promiseMiddleware()
  );

  // Create final store and subscribe router in debug env ie. for devtools
  const createStoreWithMiddleware = compose(
    // related middlewares
    middleware,
    // connections to pouchdb
    persistentStore(db),
    // connection to redux dev tools
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )(createStore);

  const store = createStoreWithMiddleware(
    rootReducer,
    initialState
  );
  // live-reloading handling
  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
