import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Link, Switch, Route, Redirect, withRouter } from "react-router-dom";
import { Button, Container, Menu, Segment } from "semantic-ui-react";

import "./App.css";
import HomeScreen from "./screens/Home";

function App() {
  return (
    <div className="App">
      <div>
        <Switch>
          <Route exact path="/" component={HomeScreen} />
          {/* <Route path="/profile/:login" component={ProfileScreen} /> */}
        </Switch>
      </div>
    </div>
  );
}

export default App;
