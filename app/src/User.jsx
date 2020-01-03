import React from 'react';


export default class Login extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <div style={{ padding: "2%" }}>
        <p><b>Username:</b> {user.username}</p>
        <p><b>Last login:</b> {(new Date()).toISOString()}</p>
      </div>
    );
  }
}

