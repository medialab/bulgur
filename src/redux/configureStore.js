import {applyMiddleware, createStore, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import promiseMiddleware from './promiseMiddleware';
import { persistentStore } from 'redux-pouchdb';
import { persistentReducer } from 'redux-pouchdb';

const PouchDB = require('pouchdb');

const db = new PouchDB('bulgur');

export default function configureStore (initialState = {}) {
  // Compose final middleware and use devtools in debug environment
  const middleware = applyMiddleware(
    thunk,
    promiseMiddleware()
  );

  // Create final store and subscribe router in debug env ie. for devtools
  const createStoreWithMiddleware = compose(
    middleware,
    persistentStore(db),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )(createStore);

  const persistedReducer = persistentReducer(rootReducer);

  const store = createStoreWithMiddleware(
    persistedReducer, 
    initialState
  );

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
