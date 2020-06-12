import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { createPopout, removePopout } from './../../../modules';
import { findAncestor } from './../../../util';
import './Popout.scss';

class Popout extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isShowing: false
    };

    this.createdAt = Date.now();
    this.escListener = (e) => e.keyCode === 27 && this.actionMade('cancel', e);
    this.clickListener = (event) => {
      let el = event.target;
      el = findAncestor(el, 'popout')

      if (el) {
        return;
      } else {
        this.close();
      }
    };
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
    this.forceUpdate();
  }

  updateSelf () {
    const { position } = this.state;
    const content = this.content ? this.content() : this.props.content;
    if (!content) return null;
    removePopout();
    createPopout('popout', content, { position });
  }

  click (event) {
    const { placement = 'right', style } = this.props;
    const content = this.content ? this.content() : this.props.content;
    if (!content) {
      return event.preventDefault();
    }
    if (content.props && style) {
      content.props.style = { top: style.top, left: style.left }
    }
    window.listeners.subscribe('keydown', this.escListener, false);
    window.listeners.subscribe('click', this.clickListener, false);
    
    this.setState({ isShowing: true });
    const pseudoPopout = document.createElement('div');
    pseudoPopout.classList.add('popout');
    pseudoPopout.innerHTML = content;
    document.querySelector('.popouts').appendChild(pseudoPopout)

    const predicted = pseudoPopout.getBoundingClientRect();
    const ref = event.target.getBoundingClientRect();

    const TOOLTIP_HEIGHT = predicted.height;
    const TOOLTIP_WIDTH = predicted.width;
    let position = {};
    switch (placement) {
      case 'top':
        position = { x: ref.left + (ref.width / 2) - (TOOLTIP_WIDTH / 2), y: ref.y - TOOLTIP_HEIGHT };
        break;
      case 'left':
        position = { x: ref.left - predicted.width, y: ref.y };
        break;
      case 'bottom':
        position = { x: ref.left + (ref.width / 2) - (TOOLTIP_WIDTH / 2), y: ref.bottom };
        break;
      case 'right':
        position = { x: ref.left + ref.width, y: ref.y };
        break;
      default:
        break;
    }

    pseudoPopout.remove();
    this.setState({ position, content })
    createPopout('popout', content, { position });
  }

  close (bypassMinCheck) {
    // Below minimum lifespan
    // This is a measure to prevent the popout from immediately disappearing
    if (Date.now() - this.createdAt < 100 || !this.state.isShowing) {
      if (!bypassMinCheck) {
        return;
      }
    }
    const { onClose = () => void 0 } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
    window.listeners.unsubscribe('keydown', this.escListener, false);
    window.listeners.unsubscribe('click', this.clickListener, false);
    removePopout();
  }

  componentWillUnmount () {
    this.close(true);
  }

  render () {
    let { children, className, style } = this.props;
    if (!Array.isArray(children)) {
      children = [children];
    }
    const newChildren = React.Children.map(this.props.children, (child, i) => !i
      ? React.cloneElement(child, { style, onClick: this.click.bind(this) })
      : child);
    return (
      <>
        {newChildren}
      </>
    );
  }
}

const PopoutRouter = withRouter(Popout);
export default Popout;
export { PopoutRouter };
