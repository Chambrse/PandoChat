import React, { Component } from "react";
import "./css/App.css";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Loading from './pages/Loading';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Axios from "axios";
import { TransitionGroup, CSSTransition } from "react-transition-group";

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
        this.setState(response.data.data);
      }
      this.setState({ loading: 'done' });
    });
  }

  componentWillMount() {
    this.getUser();
  }

  updateAppState(data) {
    this.setState(data);
  }

  render() {
    if (this.state.loading === 'initial') { return <Loading /> }
    return (
      <Router>
        <Route
          render={({ location }) => (
            <TransitionGroup>
              <CSSTransition
                key={location.key}
                appear={true}
                classNames="page"
                timeout={1000}
              >
                <Switch location={location}>
                  <Route exact path="/login"
                    render={() => (
                      <div className='container' style={{ position: 'relative' }}>
                        <Login
                          loggedIn={this.state.loggedIn}
                          updateAppState={this.updateAppState} />
                       </div>
                    )} />
                  <Route exact path="/register"
                    render={() => (
                      <div className='container' style={{ position: 'relative' }}>
                        <Register
                          loggedIn={this.state.loggedIn}
                          updateAppState={this.updateAppState}
                        />
                      </div>
                    )} />
                  <Route path="/"
                    render={() => (
                      <div style={{ position: 'relative' }}>
                        <Home
                          loggedIn={this.state.loggedIn}
                          updateAppState={this.updateAppState}
                          user={this.state.user}
                        />
                      </div>

                    )} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          )} />
      </Router>
    );
  }
}

export default App;

