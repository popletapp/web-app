import React, { Component } from 'react';
import { Flex, FlexChild, Button } from './../../';
import { Link } from 'react-router-dom';
import messages from './error/messages.json';
import './ErrorBoundary.scss';
import * as Sentry from '@sentry/browser';

class ErrorBoundary extends Component {
  constructor (props) {
    super(props);
    this.state = { errored: false };
  }

  static getDerivedStateFromError () {
    return { errored: true };
  }

  componentDidCatch (e, errorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
    });
  }

  render () {
    const { errored } = this.state;
    const { children } = this.props;

    return errored ? (
      <div className='error-boundary center-on-page animated fadeIn'>
        <Flex align='center' grow={0} className='error-occurred'>
          <FlexChild grow={0} className='error-title'>
            An error occurred
          </FlexChild>
          <FlexChild grow={0} className='error-description'>
            {messages[Math.floor(Math.random() * messages.length)]}
          </FlexChild>
        </Flex>

        <Flex align='center' grow={0} className='error-instructions'>
          <p>
            We've logged this error, and we'll look into it as quick as we can.<br/>
            If the error keeps happening, consider filing a bug report on our <Link to='/feedback'>Feedback</Link> page.
          </p>
        </Flex>

        <Button onClick={() => window.location.reload()} grow={0} className='error-reload-button'>
          Reload
        </Button>
      </div>
    ) : children;
  }
}

export default ErrorBoundary;
