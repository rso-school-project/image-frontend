import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser, faPowerOff, faImages, faShareAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import './static/css/App.css';
import './static/css/bootstrap.min.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import Gallery from './Gallery';
import Login from './Login';
import User from './User';

library.add(faUser, faPowerOff, faImages, faShareAlt, faSignOutAlt);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,//{ username: "timotej", id: 1 },
    };
  }

  handleSetUser = (user) => {
    this.setState({
      user: user,
    });
  }

  logout = () => {
    this.setState({
      user: null,
    });
  }

  render() {
    const { user } = this.state;
    if (!user) return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={props => <Login handleSetUser={this.handleSetUser} />} />
          <Route render={() => <Redirect to="/"/>} />
        </Switch>
      </BrowserRouter>
    );
    return (
      <div className="App">
        <BrowserRouter>
          <Route render={({ location, history }) => (
              <React.Fragment>
                  <SideNav
                      onSelect={(selected) => {
                          const to = '/' + selected;
                          if (location.pathname !== to) {
                              history.push(to);
                          }
                      }}
                  >
                      <SideNav.Toggle />
                      <SideNav.Nav defaultSelected="images">
                          <NavItem eventKey="images">
                              <NavIcon>
                                  <FontAwesomeIcon icon="images" style={{ fontSize: '1.75em' }} />
                              </NavIcon>
                              <NavText>
                                  Images
                              </NavText>
                          </NavItem>
                          <NavItem eventKey="shared">
                              <NavIcon>
                                  <FontAwesomeIcon icon="share-alt" style={{ fontSize: '1.75em' }} />
                              </NavIcon>
                              <NavText>
                                  Shared
                              </NavText>
                          </NavItem>
                          <hr/>
                          <NavItem eventKey="user">
                              <NavIcon>
                                  <FontAwesomeIcon icon="user" style={{ fontSize: '1.75em' }} />
                              </NavIcon>
                              <NavText>
                                  User
                              </NavText>
                          </NavItem>
                          <NavItem eventKey="logout" onClick={this.logout}>
                              <NavIcon>
                                  <FontAwesomeIcon icon="sign-out-alt" style={{ fontSize: '1.75em' }} />
                              </NavIcon>
                              <NavText>
                                  Log out
                              </NavText>
                          </NavItem>
                      </SideNav.Nav>
                  </SideNav>
                  <main style={{ paddingLeft: "64px", height: "100vh", overflowY: "scroll"}}>
                    <Switch>
                      <Route path="/" exact component={props => <Gallery user={user} />} />
                      <Route path="/images" exact component={props => <Gallery user={user} />} />
                      <Route path="/shared" component={props => <Gallery user={user} shared />} />
                      <Route path="/user" component={props => <User user={user} />} />
                      <Route render={() => <Redirect to="/"/>} />
                    </Switch>
                  </main>
              </React.Fragment>
          )}
          />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
