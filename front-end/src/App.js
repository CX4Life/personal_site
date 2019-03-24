import React, { Component } from 'react';
import { Header, Posts, Footer } from './components';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Posts />
        <Footer />
      </div>
    );
  }
}


export default App;
