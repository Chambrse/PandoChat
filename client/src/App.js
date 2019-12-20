import React, { Component } from "react";
import "./css/App.css";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Loading from './pages/Loading';
import ChooseProperties from './pages/ChooseProperties';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
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
    // console.log("app render");
    if (this.state.loading === 'initial') { return <Loading /> }
    return (
      <div style={{ className: 'container' }} id='navbar'>
        <div style={{ height: '50px', className: 'row'}}>
          <p>This is the navbar</p>
        </div>
        <Router >
          <Route
            render={({ location }) => (
              <TransitionGroup>
                <CSSTransition
                  key={location.key}
                  appear={true}
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
                        <div style={{ position: 'relative' }}>
                          <Home
                            location={location}
                            loggedIn={this.state.loggedIn}
                            updateAppState={this.updateAppState}
                            user={this.state.user}
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
                        </div>
                      )} />
                    <Route exact path="/" render={() => <Redirect to="/home" />} />
                    <Route render={() => <div>Not Found</div>} />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            )} />
        </Router>
      </div>
    );
  }
}

export default App;

