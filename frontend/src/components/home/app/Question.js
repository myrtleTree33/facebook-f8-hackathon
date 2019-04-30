import React from "react";
import PropTypes from "prop-types";
import { Container, Segment } from "semantic-ui-react";
import App from "./App";

const Question = ({ question }) => {
  return (
    <Segment
      style={{
        textAlign: "left"
      }}
    >
      <div>{question.questionText}</div>
      <div>
        <em>{question.text}</em>
      </div>
    </Segment>
  );
};

export default Question;
