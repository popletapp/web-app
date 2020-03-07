import React, { Component } from 'react';
import { Flex, FlexChild, Button } from './../../';
import { Link } from 'react-router-dom';
import messages from './error/messages.json';
import './ErrorBoundary.scss';
import Poplet from './../../../';
import * as Sentry from '@sentry/browser';
import { withTranslation }  from 'react-i18next';

class ErrorBoundary extends Component {
  constructor (props) {
    super(props);
    this.state = { errored: false };
  }

  static getDerivedStateFromError () {
    return { errored: true };
  }

  componentDidCatch (e, errorInfo) {
    const store = Poplet.store;
    const state = store.getState();
    Poplet.log.prefix(Poplet.log.PREFIX_TYPES.STORE).error(`Poplet has encountered an unrecoverable error and can't continue to render.
    \nBelow is some information that will be sent to the developer; this is basic information that may be used to help fix issues more easily.`)
    console.log(state);
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
    });
  }

  render () {
    const { errored } = this.state;
    const { children, t } = this.props;

    return errored ? (
      <div className='error-boundary center-on-page animated fadeIn'>
        <Flex align='center' grow={0} className='error-occurred'>
          <FlexChild grow={0} className='error-title'>
            {t("FATAL_ERROR_TITLE")}
          </FlexChild>
          <FlexChild grow={0} className='error-description'>
            {/* TODO: translations for this stuff ;) */}
            {messages[Math.floor(Math.random() * messages.length)]}
          </FlexChild>
        </Flex>

        <Flex align='center' grow={0} className='error-instructions'>
          <p>
            {t("FATAL_ERROR_BODY_LINE_1")}<br/>
            {t("FATAL_ERROR_BODY_LINE_2")} <Link to='/feedback'>{t("FATAL_ERROR_BODY_LINE_3")}</Link>
          </p>
        </Flex>

        <Button onClick={() => window.location.reload()} grow={0} className='error-reload-button'>
          {t("FATAL_ERROR_RELOAD")}
        </Button>
      </div>
    ) : children;
  }
}

export default withTranslation()(ErrorBoundary);
