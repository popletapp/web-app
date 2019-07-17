import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, Board, Landing, Login } from './../../../pages';

class App extends Component {
  render () {
    return (
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route exact path='/home' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route path='/boards/:id' component={Board} />
      </Switch>
    );
  }
}

export default App;
