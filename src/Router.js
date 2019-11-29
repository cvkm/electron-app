
import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import App from "./App";
import addWindow from "./addWindow";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/add" component={addWindow} />
    </Switch>
  </BrowserRouter>
);

export default Router;
