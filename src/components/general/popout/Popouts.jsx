import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popout } from './../../';

function mapStateToProps (state) {
  return {
    popouts: state.popouts
  };
}

class Popouts extends Component {
  render () {
    const { popouts } = this.props;
    return (
      <div className='popouts animated'>
        {popouts.map((popout, i) => <Popout style={{ top: popout.options.position.y, left: popout.options.position.x }} className={`${popout.id}`} key={i}>{popout.popout}</Popout>)}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Popouts);
