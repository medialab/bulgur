import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import promiseMiddleware from './promiseMiddleware';

export default function configureStore (initialState = {}) {
  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(
    thunk,
    promiseMiddleware(),
  );
  // Create final store and subscribe router in debug env ie. for devtools
  const store = middleware(createStore)(
    rootReducer, 
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default;

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
