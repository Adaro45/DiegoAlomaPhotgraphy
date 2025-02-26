import React from "react";
import Router from "./Routes/Router";
import Header from "./Layout/Components/Header";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <Header />
    <Router />
    </BrowserRouter>
  );
}
export default App;
