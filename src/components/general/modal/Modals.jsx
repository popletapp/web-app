import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Backdrop, Modal } from '././../../';

function mapStateToProps (state) {
  return {
    modals: state.modals
  };
}

class Modals extends Component {
  render () {
    const { modals } = this.props;
    return (
      <div className='modals animated'>
        {modals.map((modal, i) => {
          if (!i) {
            return <><Backdrop /><Modal key={i}>{modal}</Modal></>;
          }
          return <Modal key={i}>{modal}</Modal>;
        })
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Modals);
