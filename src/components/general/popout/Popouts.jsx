import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popout } from './../../';
import { joinClasses } from './../../../util';

function mapStateToProps (state) {
  return {
    popouts: state.popouts
  };
}

class Popouts extends Component {
  render () {
    const { popouts, className } = this.props;
    console.log(popouts)
    return (
      <div className='popouts animated'>
        {popouts.map((popout, i) => 
          <Popout 
            style={{ top: popout.options.position.y, left: popout.options.position.x }} 
            className={joinClasses('popout', className)}
            aria-labelledby='popout-title' 
            aria-describedby='popout-content'
            key={i}>
            {popout.popout}
          </Popout>)
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Popouts);
