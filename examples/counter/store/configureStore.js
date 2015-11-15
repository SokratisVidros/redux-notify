import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import notify from 'redux-notify';
import invariant from 'redux-immutable-state-invariant';
import reducer from '../reducers';
import notifyEvents from '../events/notifyEvents';

const middleware = [
  notify(notifyEvents),
  thunk,
  invariant()
];

export default function configureStore(initialState) {
  const finalCreateStore = compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = finalCreateStore(reducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
