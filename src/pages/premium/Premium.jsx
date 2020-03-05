import React, { Component } from 'react';
import { NavBar, Flex } from '../../components';
import { Link } from 'react-router-dom';
import './Premium.scss';

class Premium extends Component {
  render () {
    return (
      <div className='premium'>
        <section className='landing-cinematic'>
            <NavBar icon='poplet_black_no_bg' />
            <div className='inner'>
              <div className='intro-title'>
                <h1 className='main-title'>Poplet Premium</h1>
                <h3 className='intro-description-title'>Take note-taking one step further with Poplet Premium</h3>
                <p className='intro-description'>This page is still under development!</p>
                <Flex direction='row' align='center' className='intro-details'>
                  <Link to='/login' className='btn intro-getstarted-btn'>Get started</Link>
                  <Link to='/about'>or learn more</Link>
                </Flex>
              </div>
            </div>
          </section>
      </div>
    );
  }
}

export default Premium;
