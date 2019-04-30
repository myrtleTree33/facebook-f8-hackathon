import React from "react";
import PropTypes from "prop-types";
import { Container, Segment } from "semantic-ui-react";
import SearchComponent from "./SearchComponent";

const App = () => {
  return (
    <div>
      <Container>
        <SearchComponent />
      </Container>
    </div>
  );
};

export default App;
