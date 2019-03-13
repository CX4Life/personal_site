import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Tim Woods
        </header>
        <div className="body">
          <p>This is the personal site of Tim Woods.</p>
          <p>It's a work in progress, but there's some cool stuff happening.
             This front-end is made by `create-react-app`, and is running in a Docker container.
             The container is run by `docker-compose`, allowing for breaking out of various
             components of this web app. </p>
        </div>
      </div>
    );
  }
}

export default App;
