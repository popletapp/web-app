import React, { Component } from 'react';
import './CriticalFailure.scss';
import { withTranslation } from 'react-i18next';

class Connecting extends Component {
  constructor () {
    super();
    this.state = {};
  }

  render () {
    const { t } = this.props;
    return (
      <div className='center-on-page critical-failure animated fadeIn'>
        <h1>{t("CONNECTING_TITLE")}</h1>
        <h2>{t("CONNECTING_BODY_LINE_1")}</h2>
        <h4>{t("CONNECTING_BODY_LINE_2")}</h4>
        <h5>{t("CONNECTING_BODY_LINE_3")}</h5>
      </div>
    );
  }
}

export default withTranslation()(Connecting);
