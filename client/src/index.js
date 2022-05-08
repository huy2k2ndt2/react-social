import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
// import { persistor, store } from "./redux/store";
// import { PersistGate } from "redux-persist/integration/react";
import store from "./redux/store";

import "./index.css";
import GlobalStyles from "./components/GlobalStyles";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <GlobalStyles>
          <App />
        </GlobalStyles>
      </BrowserRouter>
      {/* </PersistGate> */}
      <ToastContainer />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
