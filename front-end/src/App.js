import React, { Component } from 'react';
import { Header, Body, Footer } from './components';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Body />
        <Footer />
      </div>
    );
  }
}


export default App;
