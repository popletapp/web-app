import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Home, Board, DevBlog, Landing, Login, SignUp, NotFound, User, Feedback, UserSettings, Post, PostCreator, Premium } from './../../../pages';
import {
  Modals,
  BoardJoinModal,
  BoardCreationModal,
  Tooltips,
  Popouts,
  ContextMenus,
  ErrorBoundary
} from './../../../components';
import { createModal } from './../../../modules';
import { joinClasses } from './../../../util';
import { connect } from 'react-redux';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import { initReactI18next, Translation } from 'react-i18next';

i18next.use(XHR)
  .use(initReactI18next)
  .init({
    fallbackLng: ['en', 'vi', false],
    ns: ['translation'],
    backend: {
      loadPath: '/translations/{{lng}}/{{ns}}.json'
    },
    react: {
      useSuspense: false
    }
  });

function mapStateToProps (state) {
  return {
    user: state.user
  };
}

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
    if (!this.props.user.lang && nextProps.user.lang) {
      i18next.changeLanguage(nextProps.user.lang);
    }

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
    const { location, user } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      (this.previousLocation && this.previousLocation !== location)
    );

    return (
      <div className={joinClasses('app', user.theme ? 'theme-light' : 'theme-dark')}>
        <div id='loader' />
        <ErrorBoundary>
          <Switch location={isModal ? this.previousLocation : location}>
            <Route exact path='/home' component={Home} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/feedback' component={Feedback} />
            <Route exact path='/settings' component={UserSettings} />
            <Route exact path='/premium' component={Premium} />
            <Route exact path='/blog' component={DevBlog} />
            <Route exact path='/blog/create' component={PostCreator} />
            <Route exact path='/' component={Landing} />

            <Route exact path='/blog/post/:id' component={Post} />

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
            <Popouts />
            <ContextMenus />
          </div>
        </ErrorBoundary>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(App);
