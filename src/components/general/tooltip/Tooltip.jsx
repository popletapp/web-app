import React, { Component } from 'react';
import { createTooltip, clearTooltips } from './../../../modules';
import './Tooltip.scss';

class Tooltip extends Component {
  constructor () {
    super();
    this.state = { isShowing: false };
    this.tooltipRef = React.createRef();
  }

  hover (event) {
    /* function isParent (refNode, otherNode) {
      var parent = otherNode.parentNode;
      do {
        if (refNode === parent) {
          return true;
        } else {
          parent = parent.parentNode;
        }
      } while (parent);
      return false;
    } */

    const { placement = 'top', text } = this.props;
    this.setState({ isShowing: true });
    const ref = event.target.getBoundingClientRect();

    const TOOLTIP_HEIGHT = 40;
    let position = {};
    switch (placement) {
      case 'top':
        position = { x: ref.left + (ref.width / 2), y: ref.y - TOOLTIP_HEIGHT };
        break;
      case 'left':
        position = { x: ref.left, y: ref.y - (ref.offsetHeight / 2) };
        break;
      case 'bottom':
        position = { x: ref.left + (ref.width / 2), y: (ref.y + ref.height) + TOOLTIP_HEIGHT };
        break;
      case 'right':
        position = { x: ref.left + ref.width, y: ref.y - (ref.height / 2) };
        break;
      default:
        break;
    }
    createTooltip({ text, position });
  }

  unhover () {
    this.setState({ isShowing: false });
    clearTooltips();
  }

  render () {
    let { children } = this.props;
    if (!Array.isArray(children)) {
      children = [children];
    }
    const newChildren = React.Children.map(this.props.children, (child, i) => !i
      ? React.cloneElement(child, { onMouseEnter: this.hover.bind(this), onMouseLeave: this.unhover.bind(this) })
      : child);
    return (
      <>
      {newChildren}
      </>
    );
  }
}

export default Tooltip;
