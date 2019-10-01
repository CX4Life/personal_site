import React, { Component } from 'react';
import { Home, Blog } from './Pages'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path='/' component={Home} />
          <Route path='/blog' component={Blog} />
        </div>
      </Router>
    );
  }
}
