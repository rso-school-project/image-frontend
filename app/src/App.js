import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser, faPowerOff, faImages, faShareAlt } from "@fortawesome/free-solid-svg-icons";

import './static/css/App.css';
import './static/css/bootstrap.min.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import Gallery from './Gallery';

library.add(faUser, faPowerOff, faImages, faShareAlt);

function App() {
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
                        <NavItem eventKey="logout">
                            <NavIcon>
                                <FontAwesomeIcon icon="power-off" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                Logout
                            </NavText>
                        </NavItem>
                    </SideNav.Nav>
                </SideNav>
                <main style={{ paddingLeft: "64px", height: "100vh", overflowY: "scroll"}}>
                    <Route path="/" exact component={props => <Gallery />} />
                    <Route path="/images" exact component={props => <Gallery />} />
                    <Route path="/shared" component={props => <Gallery shared />} />
                    {/*<Route path="/user" component={props => <Images />} />*/}
                </main>
            </React.Fragment>
        )}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
