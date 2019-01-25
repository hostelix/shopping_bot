import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

//Components
import App from "./App";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";

export default class AppRoutes extends Component {
  render() {
    return (
      <App>
        <Switch>
          <Route exact path="/" name="signin" component={SignIn} />
          <Route
            exact
            path="/dashboard"
            name="dashboard"
            component={Dashboard}
          />
        </Switch>
      </App>
    );
  }
}
