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
    const { placement = 'top', content } = this.props;
    this.setState({ isShowing: true });
    const pseudoTooltip = document.createElement('div');
    pseudoTooltip.classList.add('tooltip');
    pseudoTooltip.innerHTML = content;
    document.querySelector('.tooltips').appendChild(pseudoTooltip)

    const predicted = pseudoTooltip.getBoundingClientRect();
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
    pseudoTooltip.remove();
    createTooltip({ content, position });
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
