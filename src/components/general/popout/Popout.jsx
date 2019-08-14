import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { removePopout } from './../../../modules';
import { joinClasses } from './../../../util';
import './Popout.scss';

class Popout extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showing: false,
      firstClick: true
    };
    this.escListener = (e) => e.keyCode === 27 && this.actionMade('cancel', e);
    this.clickListener = (event) => {
      this.setState({ firstClick: false });
      let el = event.target;
      do {
        if (el.matches('.popout')) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);

      if (el && el.classList && el.classList.contains('popout') && this.onClick && typeof this.onClick === 'function') {
        this.actionMade('cancel', event);
      } else {
        this.close();
      }
    };
    document.addEventListener('keydown', this.escListener, false);
    document.addEventListener('click', this.clickListener, false);
  }

  actionMade (type, event) {
    const { onCancel, onConfirm = () => {} } = this.props;
    this.close();
    if (type) {
      if (type === 'cancel' && onCancel) {
        return onCancel();
      } else {
        return onConfirm(this.state);
      }
    }
  }

  close () {
    if (this.state.firstClick) return;
    removePopout();
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.escListener, false);
    document.removeEventListener('click', this.clickListener, false);
  }

  render () {
    const { children, style, className } = this.props;
    return (
      <div className={joinClasses('popout', className)} style={style} aria-labelledby='popout-title' aria-describedby='popout-content'>
        {children}
      </div>
    );
  }
}

const PopoutRouter = withRouter(Popout);
export default Popout;
export { PopoutRouter };
