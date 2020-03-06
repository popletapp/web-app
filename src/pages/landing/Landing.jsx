import React, { Component } from 'react';
import { NavBar, Flex, FlexChild, Tooltip } from './../../components';
import { Link } from 'react-router-dom';
import app from './../../../package.json';
import './Landing.scss';
import { Messages } from '../../i18n';

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
    return (
      <div className='landing-body'>
        <div className='landing-background'></div>
        <div className='landing'>
          <section className='landing-cinematic'>
            <NavBar icon='poplet_black_no_bg' />
            <div className='inner'>
              <div className='intro-title'>
                <h1 className='main-title'>{Messages.LANDING_MAIN_TITLE}</h1>
                <h3 className='intro-description-title'>{Messages.LANDING_INTRO_DESCRIPTION}</h3>
                <p className='intro-description'>{Messages.LANDING_INTRO_SUBTEXT}</p>
                <Flex direction='row' align='center' className='intro-details'>
                  <Link to='/login' className='btn intro-getstarted-btn'>{Messages.LANDING_GET_STARTED}</Link>
                  <Link to='/about'>{Messages.LANDING_LEARN_MORE}</Link>
                </Flex>
              </div>
            </div>
          </section>
        </div>

        <div className='landing-content'>
          <div className='landing-content-card'>
            <h2 className='landing-content-card-title'>
              {Messages.LANDING_CARD_1_TITLE}
            </h2>
            <h2 className='landing-content-card-desc'>
              {Messages.LANDING_CARD_1_DESCRIPTION}
            </h2>
          </div>

          <div className='landing-content-card'>
            <h2 className='landing-content-card-title'>
              {Messages.LANDING_CARD_2_TITLE}
            </h2>
            <h2 className='landing-content-card-desc'>
              {Messages.LANDING_CARD_2_DESCRIPTION}
            </h2>
          </div>

          <div className='landing-content-card'>
            <h2 className='landing-content-card-title'>
              {Messages.LANDING_CARD_3_TITLE}
            </h2>
            <h2 className='landing-content-card-desc'>
              {Messages.LANDING_CARD_3_DESCRIPTION}
            </h2>
          </div>
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

export default Landing;
