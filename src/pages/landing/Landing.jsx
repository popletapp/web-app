import React, { Component } from 'react';
import { NavBar, Flex, FlexChild, Tooltip } from './../../components';
import { Link } from 'react-router-dom';
import app from './../../../package.json';
import './Landing.scss';

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
                <h1 className='main-title'>Thinking rethought</h1>
                <h3 className='intro-description-title'>A note-taking application with rich features</h3>
                <p className='intro-description'>Some ideas are more complex than others — Poplet strives to let you take notes the way you want.</p>
                <Flex direction='row' align='center' className='intro-details'>
                  <Link to='/login' className='btn intro-getstarted-btn'>Get started</Link>
                  <Link to='/about'>or learn more</Link>
                </Flex>
              </div>
            </div>
          </section>
        </div>

        <div className='landing-content'>
          <div className='landing-content-card'>
            <h2 className='landing-content-card-title'>
              Everything you want and more
            </h2>
            <h2 className='landing-content-card-desc'>
              Including features that you're used to like assigning members to notes, due dates, importance sorting and more.
            </h2>
          </div>

          <div className='landing-content-card'>
            <h2 className='landing-content-card-title'>
              Customization to the extreme
            </h2>
            <h2 className='landing-content-card-desc'>
              The ability to fine-tune the nitty gritty details, such as the positioning and style of your notes.
            </h2>
          </div>

          <div className='landing-content-card'>
            <h2 className='landing-content-card-title'>
              Simple collaboration with advanced features
            </h2>
            <h2 className='landing-content-card-desc'>
              Getting work done with your mates couldn't be easier.
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
