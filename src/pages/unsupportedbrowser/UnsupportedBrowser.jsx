import React, { Component } from 'react';
import './NotFound.scss';

class NotFound extends Component {
  render () {
    return (
      <div className='notfound'>
        <div className='notfound-mask'>
          <section className='top introduction row'>
            <h3>404 NOT FOUND</h3>
            <div className='inner'>
              <div className='title'>
                <h1 className='notfound-main-title'>
                Poplet
                  <img alt='Poplet' src='/assets/icons/poplet_white.svg' width='64' height='64'></img>
                </h1>
                <h3>We couldn't find what you were looking for.</h3>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default NotFound;
