import React, { Component } from "react";
import "./css/App.css";
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Loading from './pages/Loading';
import ChooseProperties from './pages/ChooseProperties';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Axios from "axios";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import About from './pages/About';
import Tutorial from './pages/Tutorial';
import AdminConsole from "./pages/AdminConsole";
import io from 'socket.io-client';


class App extends Component {
  constructor() {
    super();

    this.state = {
      loggedIn: false,
      user: null,
      loading: 'initial'
    }

    this.updateAppState = this.updateAppState.bind(this);
    this.getUser = this.getUser.bind(this);
  };

  // On load and refresh, make a request to the server to see if there is a user logged in in the current session.
  getUser() {
    Axios.get('/user').then(response => {
      if (response.data === 'not authenticated.') {
        console.log('not logged in');
      } else {
        this.setState({ loggedIn: true, user: response.data.data });
        this.socket.emit('socket-login');
      }
      this.setState({ loading: 'done' });
    });
  }

  componentWillMount() {
    this.getUser();
    this.socket = io(window.location.host);
    console.log("Welcome to Pando.Chat!")
  }

  updateAppState(data, cb) {
    // console.log("app state being updated");
    this.setState(data, () => {
      if (cb) {
        cb();
      };
    });
  }

  render() {
    if (this.state.loading === 'initial') { return <Loading /> }
    return (
      <div style={{
        display: 'flex',
        flexFlow: 'column',
        height: '100vh'
      }}>
        <Router>
          <div style={{ display: 'contents' }}>
            <Navbar
              loggedIn={this.state.loggedIn}
              user={this.state.user}
              updateAppState={this.updateAppState}
              socket={this.socket} />
            <Route
              render={({ location }) => (
                <TransitionGroup id='divOutsidePages' style={{ flex: 1 }} >
                  <CSSTransition
                    key={location.key}
                    // appear={true}
                    classNames="page"
                    timeout={1000}
                  >
                    <Switch location={location} >
                      <Route exact path="/login"
                        render={() => (
                          <div className='container' style={{ position: 'relative' }}>
                            <Login
                              location={location}
                              loggedIn={this.state.loggedIn}
                              updateAppState={this.updateAppState} />
                          </div>
                        )} />
                      <Route exact path="/register"
                        render={() => (
                          <div className='container' style={{ position: 'relative' }}>
                            <Register
                              location={location}
                              loggedIn={this.state.loggedIn}
                              updateAppState={this.updateAppState}
                            />
                          </div>
                        )} />
                      <Route path="/home"
                        render={() => (
                          <div id='homeContainer' style={{ position: 'absolute' }}>
                            <Home
                              location={location}
                              loggedIn={this.state.loggedIn}
                              updateAppState={this.updateAppState}
                              user={this.state.user}
                              socket={this.socket}
                            />
                          </div>
                        )} />
                      <Route path="/chooseProperties"
                        render={() => (
                          <div style={{ position: 'relative' }}>
                            <ChooseProperties
                              location={location}
                              loggedIn={this.state.loggedIn}
                              updateAppState={this.updateAppState}
                              user={this.state.user}
                            />
                          </div>)} />
                      <Route path="/about"
                        render={() => (
                          <div style={{ position: 'relative' }}>
                            <About
                              loggedIn={this.state.loggedIn}
                              user={this.state.user}
                              updateAppState={this.updateAppState}
                            />
                          </div>
                        )} />
                      <Route path="/admin"
                        render={() => (
                          <div style={{ position: 'relative' }}>
                            <AdminConsole>

                            </AdminConsole>
                          </div>
                        )} />
                      <Route path="/tutorial"
                        render={() => (
                          <div style={{ position: 'relative' }}>
                            <Tutorial />
                          </div>
                        )} />
                      <Route exact path="/" render={() => <Redirect to="/home" />} />
                      <Route render={() => <div>Not Found</div>} />
                    </Switch>
                  </CSSTransition>
                </TransitionGroup>
              )} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

