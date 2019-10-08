import React, { Component } from 'react';
import Axios from 'axios';
import { Home, Blog } from './Pages'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Constants from './lib/Constants';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      api: null,
      auth: null
    };
  }

  componentDidMount() {
    const auth = Axios.create({
      baseURL: Constants.AUTH_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const app_user = Constants.APP_USER;
    const app_key = Constants.APP_KEY;

    let auth_token;

    auth.post('/issue', {
      username: app_user,
      password: app_key
    }).then(response => {
      auth_token = response.data.token;
    });

    const api = Axios.create({
      baseURL: Constants.API_URL,
      headers: {
        Authorization: auth_token
      }
    });

    this.setState({
      api,
      auth
    });
  }

  render() {
    const { api } = this.state;
    return (
      <Router>
        <div className="App">
          <Route exact path='/' component={Home} />
          <Route path='/blog' component={() => (
            <Blog api={api} />)} />
        </div>
      </Router>
    );
  }
}
