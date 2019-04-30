import React, { Component } from "react";
import _ from "lodash";

import PropTypes from "prop-types";
import { Container, Segment, Search } from "semantic-ui-react";

class SearchComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: "" });

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title });
    console.log(result.title);
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      (async () => {
        const { value } = this.state;
        if (value.length < 1) return this.resetComponent();

        // TODO fill in for fetch
        const source = [];

        this.setState({
          isLoading: false,
          results: source
        });
      })();
    }, 300);
  };

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <Segment>
        <h1>Travelyay</h1>
        <Search
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true
          })}
          results={results}
          value={value}
          {...this.props}
        />
      </Segment>
    );
  }
}

export default SearchComponent;
