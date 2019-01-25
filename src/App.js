import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";

import "./components/SignIn";

class App extends Component {
  render() {
    return (
      <Router>
        <div>{this.props.children}</div>
      </Router>
    );
  }
}

export default App;
