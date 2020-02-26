import React, { Component } from 'react';
import { NavBar, Flex, FlexChild } from '../../components';
import { Link } from 'react-router-dom';
import app from './../../../package.json';
import './DevBlog.scss';

class DevBlog extends Component {
  constructor () {
    
  }

  render () {
    return (
      <div className='blog-body'>
        <div className='blog'>
          <section className='blog-cinematic'>
            <NavBar icon='poplet_black_no_bg' />
            <div className='inner'>
              <div className='intro-title'>
                <h1 className='main-title'>Poplet Blog</h1>
                <h3 className='blog-description-title'>Developer Blog + Change Logs</h3>
              </div>
              <div className='lower-half animated animatedFadeInUp fadeInUp'>
              </div>
            </div>
          </section>
        </div>

        <div className='blog-content'>

        </div>
      </div>
    );
  }
}

export default DevBlog;
