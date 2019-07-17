import React, { Component } from 'react';
import './Landing.scss';

class Landing extends Component {
  render () {
    return (
      <div className='landing'>
        <section className='top introduction row'>
          <div className='inner'>
            <div className='title'>
              <img alt='Poplet' src='./assets/icons/poplet_white.svg' width='64' height='64'></img>
            </div>
            <h1 className='main-title'>Poplet</h1>
            <div className='lower-half animated animatedFadeInUp fadeInUp'>
              <h3 className='bio'>I'm a web and software developer based in Australia.</h3>

              <div className='scrolldown-icon avatar-small'></div>
              <p className='scrolldown'>Scroll down to see things I've worked on!</p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Landing;
