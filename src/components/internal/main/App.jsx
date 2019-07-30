import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Home, Board, Landing, Login, SignUp, NotFound, User, Feedback } from './../../../pages';
import {
  Modals,
  BoardJoinModal,
  BoardCreationModal,
  Tooltips
} from './../../../components';
import { createModal } from './../../../modules';

class App extends Component {
  renderModal (path) {
    switch (path) {
      case '/boards/join': {
        createModal(<BoardJoinModal />);
        break;
      }
      case '/boards/create': {
        createModal(<BoardCreationModal />);
        break;
      }
      default: {

      }
    }
  }

  componentDidMount () {
    this.renderModal(this.props.location.pathname);
    this.props.history.listen((location, action) => {
      if (action === 'PUSH') {
        this.renderModal(location.pathname);
      }
    });
  }

  componentWillUpdate (nextProps) {
    const { location } = this.props;

    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render () {
    const { location } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      (this.previousLocation && this.previousLocation !== location)
    );

    return (
      <div className='app'>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route exact path='/home' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={SignUp} />
          <Route exact path='/feedback' component={Feedback} />
          <Route exact path='/' component={Landing} />

          <Route path='/boards/:id' component={Board} />

          <Route path='/users/:id' component={User} />

          <Route path='*' component={NotFound} />
        </Switch>

        { // Modal rendering - Boards
          !isModal && (
              <>
                <Route path='/boards/join' component={Home} />
                <Route path='/boards/create' component={Home} />
              </>
          )}

        <div data-no-focus-lock='true'>
          <Modals />
          <Tooltips />
        </div>
      </div>
    );
  }
}

export default App;
