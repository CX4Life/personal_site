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
    };
  }

  componentDidMount() {
    const api = Axios.create({
      baseURL: Constants.API_URL,
      headers: {
        Authorization: Constants.APP_JWT
      }
    });

    this.setState({
      api
    });
  }

  render() {
    const { api } = this.state;
    return (
      <Router>
        <div className="App">
          <Route exact path='/' component={Home} />
          <Route path='/blog' component={() => <Blog api={api} />} />
        </div>
      </Router>
    );
  }
}
