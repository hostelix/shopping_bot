import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

//Components
import App from "./App";
import SignIn from "./views/SignIn";
import DashboardLayout from "./layouts/DashboardLayout";

export default class AppRoutes extends Component {
  render() {
    return (
      <App>
        <Switch>
          <Route exact path="/" component={SignIn} />
          <Route path="/dashboard" component={DashboardLayout} />
        </Switch>
      </App>
    );
  }
}
