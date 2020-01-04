import React from 'react';
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap';

import { config } from "./config";
import logo from './static/img/logo.png';


function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
    });
}


export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.abortController = new AbortController();

    this.state = {
      loginError: "",
      username: "",
      password: "",
      isLoading: false,
    };
  }

  componentWillUnmount() {

  }

  login = () => {
    const { username, password } = this.state;
    if (username === "" || password === "") {
      this.setState({
        loginError: "Please fill out the fields."
      });
      return;
    }

    this.setState({ isLoading: true });

    const data = { username: username, password: password };

    fetch(config.host + "user-handler/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "unique_log_id": generateUUID()
      },
      body: JSON.stringify(data),
      signal: this.abortController.signal
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        if (response.status === 404)
          this.setState({ loginError: "Username or password is incorrect.", isLoading: false })
        else
          this.setState({ loginError: "Service currently unavailable.", isLoading: false })
      }
    })
    .then(data => {
      if (data) this.props.handleSetUser(data);
    })
    .catch(error => {
      console.log(error);
      this.setState({ loginError: "Service currently unavailable.", isLoading: false })
    });

  }

  setValue = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { loginError, isLoading } = this.state;
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
              disabled={isLoading}
            >
              {isLoading? <span><Spinner size="sm" animation="grow" />Logging in...</span> : <span>Log in</span>}
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

