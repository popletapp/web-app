import React, { Component } from 'react';
import { NavBar, Flex, FlexChild } from './../../components';
import { Link } from 'react-router-dom';
import app from './../../../package.json';
import './Landing.scss';

class Landing extends Component {
  render () {
    return (
      <div className='landing-body'>
        <div className='landing'>
          <section className='landing-cinematic'>
            <NavBar icon='poplet_black_no_bg' />
            <div className='inner'>
              <div className='intro-title'>
                <h1 className='main-title'>Thinking rethought.</h1>
                <h3 className='intro-description-title'>A note-taking application with rich features</h3>
                <p className='intro-description'>Some ideas are more complex than others — Poplet strives to let you take notes the way you want.</p>
                <Flex direction='row' align='center' className='intro-details'>
                  <Link to='/login' className='btn intro-getstarted-btn'>Get started</Link>
                  <Link to='/about'>or learn more</Link>
                </Flex>
              </div>
              <div className='lower-half animated animatedFadeInUp fadeInUp'>
              </div>
            </div>
          </section>
        </div>

        <div className='landing-content'>
          <div className='landing-content-card'>
            <h2 className='landing-content-card-title'>
              It's everything you want from note-taking apps, and more
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

            <FlexChild align='right' justify='end'>
              Yes, this landing page looks pretty barren at the moment - this is only temporary. :)
            </FlexChild>
          </Flex>
        </footer>
      </div>
    );
  }
}

export default Landing;
