import React, { Component } from "react";
import { HashRouter } from "react-router-dom";
import "./App.css";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>{this.props.children}</div>
      </HashRouter>
    );
  }
}

export default App;
