import React from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';

import logo from './static/img/logo.png';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginError: "",
      username: "",
      password: "",
    };
  }

  componentDidMount() {

  }

  login = () => {
    const { username, password } = this.state;
    if (username === "" || password === "") {
      this.setState({
        loginError: "Please fill out the fields."
      });
      return;
    }

    // TODO: API call
    this.props.handleSetUser("user1");
  }

  setValue = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { loginError } = this.state;
    return (
      <div className="login-form-container">
        <div className="login-form">
          <img className="logo" width="400px" src={logo} alt={"ImageShare"} />

          <br/><br/>

          <p>Please enter your username and password to log in.</p>
          <Form>
            <Form.Group as={Row}>
              <Col>
                <Form.Control type="text" onChange={this.setValue} name="username" placeholder="Username" />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>

              <Col>
                <Form.Control type="password" onChange={this.setValue} name="password" placeholder="Password" />
              </Col>
            </Form.Group>

            <p style={{ color: "red" }}>{loginError}&nbsp;</p>

            <Button
              onClick={this.login}
              className="float-right"
              variant="dark"
            >
              Log in
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

