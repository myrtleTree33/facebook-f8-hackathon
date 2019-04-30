import React, { Component } from "react";
import PropTypes from "prop-types";

import Home from "../components/home/Home";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    return <Home />;
  }
}

HomeScreen.propTypes = {
  //   name: PropTypes.string.isRequired
};

export default HomeScreen;
