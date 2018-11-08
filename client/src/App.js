import React, { Component } from "react";
import "./css/App.css";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Loading from './pages/Loading';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Axios from "axios";

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

  getUser() {
    Axios.get('/user').then(response => {
      console.log(response);
      if (response.data === 'not authenticated.') {
        console.log('not logged in');
      } else {
        this.setState(response.data.data);
      }
      this.setState({ loading: 'done'});
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
          <Switch>
            <Route path="/login"
              render={() => (
                <Login
                  loggedIn={this.state.loggedIn}
                  updateAppState={this.updateAppState} />
              )} />
            <Route path="/register" 
            render={() => (
              <Register
              loggedIn={this.state.loggedIn}
              updateAppState={this.updateAppState}
              />
            )} />
            <Route path="/"               
            render={() => (
              <Home
              loggedIn={this.state.loggedIn}
              updateAppState={this.updateAppState}
              user={this.state.user}
              />
            )} />
          </Switch>
      </Router>
    );
  }
}

export default App;
