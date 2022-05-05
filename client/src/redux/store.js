import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "redux-devtools-extension";

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = createStore(persistedReducer, composeEnhancers);

// export const persistor = persistStore(store);

const composeEnhancers = composeWithDevTools(applyMiddleware(thunk));

export default createStore(rootReducer, composeEnhancers);
