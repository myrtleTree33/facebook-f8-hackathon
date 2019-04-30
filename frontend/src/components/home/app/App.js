import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Segment } from "semantic-ui-react";
import SearchComponent from "./SearchComponent";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleQuery = this.handleQuery.bind(this);
  }

  handleQuery(item) {
    console.log(item);
  }

  async componentDidMount() {}

  render() {
    return (
      <div>
        <Container>
          <SearchComponent onQuery={this.handleQuery} />
          {/* <Result items={items} /> */}
        </Container>
      </div>
    );
  }
}

App.propTypes = {
  //   name: PropTypes.string.isRequired
};

export default App;
