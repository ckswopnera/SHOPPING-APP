import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { store } from "./src/store";
import App from "./App";




export default function Start() {
    // console.log({store})
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }