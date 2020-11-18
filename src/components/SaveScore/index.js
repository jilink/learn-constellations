import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Firebase, { FirebaseContext } from "../Firebase/index";

const SaveScore = ({ score }) => {
  const [username, setUsername] = React.useState(
    localStorage.getItem("username") || ""
  );
  const [submited, setSubmited] = React.useState(false);
  const firebase = new Firebase();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username) {
      localStorage.setItem("username", username);
      setSubmited(true);
      firebase.writeNewScore(username, score);
    } else {
      console.log("no you hav no nam brero");
    }
  };
  const handleChange = (event) => {
    setUsername(event.target.value);
  };
  return (
    <>
      {!submited ? (
        <Form onSubmit={handleSubmit}>
          <Form.Row className="align-items-center">
            <Col xs="auto">
              <Form.Label htmlFor="inlineFormInput" srOnly>
                Name
              </Form.Label>
              <Form.Control
                value={username}
                required
                className="mb-2"
                id="inlineFormInput"
                placeholder="ConsellationFan127"
                onChange={handleChange}
              />
            </Col>
            <Col xs="auto">
              <button type="submit" className="mb-2">
                Submit
              </button>
            </Col>
          </Form.Row>
        </Form>
      ) : (
        <p>Ok {username}, your score is saved</p>
      )}
    </>
  );
};

export default SaveScore;
