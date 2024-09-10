// redux
import { legacy_createStore as createStore, combineReducers } from 'redux';

// reducers
import { pageSectionsReducer } from './reducers/pageSections.reducer';

const rootReducer = combineReducers({
    page: pageSectionsReducer,
})

const middleware = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : undefined
export const store = createStore(rootReducer, middleware)
