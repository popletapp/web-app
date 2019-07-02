import React, { Component } from 'react';

class CriticalFailure extends Component {
    constructor () {
        super();
        this.state = {};
    }

    render () {
        return (
            <div className='poplet-root center-on-page critical-failure animated fadeIn'>
                <h1>Damn.</h1>
                <h2>An error occured whilst trying to load Poplet</h2>
                <h4>Sorry about that. Looks like we're experiencing some technical difficulties at the moment, and we're unable to connect you to Poplet.</h4>
                <h5>This is just a temporary issue, and Poplet will up and running in no time. Thanks for your patience.</h5>
            </div>
        )
    }
}

export default CriticalFailure;