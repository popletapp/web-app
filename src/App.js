import React, { Component } from 'react';
import App from './components/App';
import "./App.css";

class Poplet extends Component {
  constructor ({ board }) {
    super();
    this.board = board;
  }

  render () {
    return ( /* get the current selected board, this is a placeholder object */
      <App board={this.board || {
          name: 'test board',
          avatar: 'https://www.sbs.com.au/programs/sites/sbs.com.au.programs/files/guy_sebastian_4384-resize_0.jpg',
          members: ['1']
      }} />
    );
  }
}

export default Poplet;