import React, { Component } from 'react';
import Axios from 'axios';
import { Home, Blog, Resume, ServiceWorkerDemo } from './Pages'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import Constants from './lib/Constants';
import './App.css';

const pdf_blob_url = 'https://sitestorage2019.blob.core.windows.net/images/tim_woods_resume.pdf?sp=rl&st=2019-11-04T03:03:12Z&se=2100-01-01T20:00:00Z&sv=2019-02-02&sr=b&sig=u6cwRvxyBaGY7voEYVTwz4T%2BTih6OnP9IpLlnIacBiM%3D'
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
          <Route path='/resume' component={() => {
            window.location.href = pdf_blob_url;
            return null;
          }} />
          <Route path='/serviceWorker' component={() => <ServiceWorkerDemo api={api} />} />
        </div>
      </Router>
    );
  }
}
