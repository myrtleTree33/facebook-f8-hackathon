import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Segment } from "semantic-ui-react";
import ky from "ky";
import SearchComponent from "./SearchComponent";
import Question from "./Question";

import logo from "./hanoi-main.jpg";

const { REACT_APP_BACKEND_URL } = process.env;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: null,
      questions: []
    };
    this.handleQuery = this.handleQuery.bind(this);
  }

  async handleQuery(item) {
    console.log(item);

    const questions = await ky
      .post(`${REACT_APP_BACKEND_URL}/cities/info`, {
        json: {
          city: item.cityName
        }
      })
      .json();

    console.log(questions);

    this.setState({
      city: item,
      questions
    });
  }

  async componentDidMount() {}

  render() {
    return (
      <div>
        <Container>
          <SearchComponent onQuery={this.handleQuery} />
          {this.state.questions.length === 0 ? <img src={logo} /> : <div />}
          {this.state.questions.map(q => (
            <Question question={q} />
          ))}
        </Container>
      </div>
    );
  }
}

App.propTypes = {
  //   name: PropTypes.string.isRequired
};

export default App;
