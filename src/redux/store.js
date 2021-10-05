import { combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import userReducer from "./users/userReducer";

const rootReducer = combineReducers({
    User: userReducer
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;