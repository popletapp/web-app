import React, { Component } from 'react';
import { connect } from 'react-redux';

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
        {popouts.map((popout, i) => <div style={{ top: popout.position.y, left: popout.position.x }} className='popout' key={i}>{popout.content}</div>)}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Popouts);
