import React, { Component } from 'react';
import { NavBar, Flex, FlexChild } from './../../components';
import app from './../../../package.json';
import './Landing.scss';

class Landing extends Component {
  render () {
    return (
      <div>
        <NavBar />
        <div className='landing'>
          <section className='landing-cinematic'>
            <div className='inner'>
              <div className='title'>
                <img alt='Poplet' src='./assets/icons/poplet_white.svg' width='64' height='64'></img>
                <h1 className='main-title'>Poplet</h1>
              </div>
              <div className='lower-half animated animatedFadeInUp fadeInUp'>
                <h3 className='bio'></h3>
              </div>
            </div>
          </section>
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
