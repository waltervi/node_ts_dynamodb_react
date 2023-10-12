import React from "react";
import ReactDOM from "react-dom/client";
import { renderToString } from "react-dom/server";
import App from "./App";

//render HTML
const str = renderToString(<App />);
console.log(str);

const rootElement = document.getElementById("root");
if (rootElement != null) {
  if (rootElement.hasChildNodes()) {
    ReactDOM.hydrateRoot(rootElement, <App />);
  } else {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

