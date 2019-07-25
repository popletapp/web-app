import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, Board, Landing, Login, SignUp } from './../../../pages';
import 'react-router-modal/css/react-router-modal.css';
import { ModalContainer, ModalRoute } from 'react-router-modal';
import { BoardJoinModal } from './../../../components';

class App extends Component {
  render () {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/home' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={SignUp} />
          <ModalRoute path='/boards/join' component={BoardJoinModal} />
          <Route path='/boards/create' component={Board} />
          <Route path='/boards/:id' component={Board} />
        </Switch>
        <ModalContainer />
      </div>
    );
  }
}

export default App;
