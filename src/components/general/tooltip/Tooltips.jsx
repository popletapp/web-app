import React, { Component } from 'react';
import { connect } from 'react-redux';

function mapStateToProps (state) {
  return {
    tooltips: state.tooltips
  };
}

class Tooltips extends Component {
  render () {
    const { tooltips } = this.props;
    return (
      <div className='tooltips animated'>
        {tooltips.map((tooltip, i) => <div style={{ top: tooltip.position.y, left: tooltip.position.x }} className='tooltip' key={i}>{tooltip.text}</div>)}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Tooltips);
