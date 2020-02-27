import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { createPopout, removePopout } from './../../../modules';
import { joinClasses } from './../../../util';
import './Popout.scss';

class Popout extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isShowing: false
    };
    this.escListener = (e) => e.keyCode === 27 && this.actionMade('cancel', e);
    this.clickListener = (event) => {
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
    const { placement = 'top', style } = this.props;
    const content = this.content ? this.content() : this.props.content;
    if (!content) {
      return event.preventDefault();
    }
    if (content.props && style) {
      content.props.style = { top: style.top, left: style.left }
    }
    
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

  close () {
    const { onClose = () => void 0 } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
    document.removeEventListener('keydown', this.escListener, false);
    document.removeEventListener('click', this.clickListener, false);
    removePopout();
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.escListener, false);
    document.removeEventListener('click', this.clickListener, false);
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
