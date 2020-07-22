import React, { Component } from 'react';
import { NavBar, Flex, FlexChild, Tooltip } from '../../components';
import { Link } from 'react-router-dom';
import app from './../../../package.json';
import './About.scss';
import { withTranslation } from 'react-i18next';

class Landing extends Component {
  constructor () {
    super();
    this.listener = document.addEventListener('click', (e) => {
      if (e.target.href === window.location.origin + '/login' || e.target.href === window.location.origin + '/signup') {
        const bg = document.querySelector('.landing-background');
        if (bg) {
          bg.classList.add('landing-background-animated');
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => document.location.replace(e.target.href), 350);
      }
    })
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.listener)
  }

  render () {
    const { t } = this.props;
    return (
      <div className='landing-body'>
        <div className='landing-background'></div>
        <div className='landing'>
          <section className='landing-cinematic'>
            <NavBar icon='poplet_black_no_bg' />
            <div className='inner'>
              <div className='intro-title'>
                <h1 className='main-title'>{t("LANDING_MAIN_TITLE")}</h1>
                <div className='intro-info'>
                  <h3 className='intro-description-title'>{t("LANDING_INTRO_DESCRIPTION")}</h3>
                  <p className='intro-description'>{t("LANDING_INTRO_SUBTEXT")}</p>

                  <Flex direction='row' align='center' className='intro-details'>
                    <Link to='/login' className='btn intro-getstarted-btn'>{t("LANDING_GET_STARTED")}</Link>
                    <Link to='/about'>{t("LANDING_LEARN_MORE")}</Link>
                  </Flex>
                </div>
              </div>
            </div>

              {/*<div className='landing-content'>
                <div className='landing-content-card'>
                  <h2 className='landing-content-card-title'>
                    {t("LANDING_CARD_1_TITLE")}
                  </h2>
                  <h2 className='landing-content-card-desc'>
                    {t("LANDING_CARD_1_DESCRIPTION")}
                  </h2>
                </div>

                <div className='landing-content-card'>
                  <h2 className='landing-content-card-title'>
                    {t("LANDING_CARD_2_TITLE")}
                  </h2>
                  <h2 className='landing-content-card-desc'>
                    {t("LANDING_CARD_2_DESCRIPTION")}
                  </h2>
                </div>

                <div className='landing-content-card'>
                  <h2 className='landing-content-card-title'>
                    {t("LANDING_CARD_3_TITLE")}
                  </h2>
                  <h2 className='landing-content-card-desc'>
                    {t("LANDING_CARD_3_DESCRIPTION")}
                  </h2>
                </div>
            </div>*/}

            <div className='gloss-note'>
              <div className='gloss-note-title'>{t("LANDING_CARD_1_TITLE")}</div>
              <div className='gloss-note-description'>{t("LANDING_CARD_1_DESCRIPTION")}</div>
              <div className='gloss-note-footer'>
                <i className='material-icons' style={{ fontSize: '13px' }}>comment</i> 0
              </div>
            </div>

            <Flex grow={1} shrink={0} className='detailed-note' direction='row'>
              <FlexChild grow={0} shrink={1} className='detailed-note-section'>
                  {/* picture? */}
              </FlexChild>

              <FlexChild grow={0} shrink={1} className='detailed-note-info'>
                <div className='detailed-note-info-title'>
                  {t("LANDING_CARD_2_TITLE")}
                </div>
                <div className='detailed-note-info-description'>
                  {t("LANDING_CARD_2_DESCRIPTION")}
                </div>
              </FlexChild>
            </Flex>

            <div className='thought-container'>
              <h1>{t("LANDING_CARD_3_TITLE")}</h1>
              <div className='detailed-note-info-description'>
                {t("LANDING_CARD_3_DESCRIPTION")}
              </div>
            </div>
           
          </section>
        </div>

        <footer>
          <Flex align='center' direction='row'>
            <FlexChild align='left'>
              Poplet v.{app.version} beta
            </FlexChild>

            <FlexChild className='landing-links' align='right' justify='end'>
              <Link to='/'>Landing</Link>
              <Link to='/blog'>Blog</Link>
              <Link to='/feedback'>Feedback</Link>
              <Tooltip content="Doesn't exist yet!"><Link to='/404'>Privacy Policy</Link></Tooltip>
              <Link to='/help'>Help</Link>
            </FlexChild>
          </Flex>
        </footer>
      </div>
    );
  }
}

export default withTranslation()(Landing);
