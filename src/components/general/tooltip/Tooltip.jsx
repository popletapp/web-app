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
    const { placement = 'top', content, hoverDuration = 100 } = this.props;
    const ref = event.target.getBoundingClientRect();

    const create = () => {
      this.setState({ isShowing: true });
      const pseudoTooltip = document.createElement('div');
      pseudoTooltip.classList.add('tooltip');
      pseudoTooltip.innerHTML = content;
      document.querySelector('.tooltips').appendChild(pseudoTooltip)
      const predicted = pseudoTooltip.getBoundingClientRect();
      
      const TOOLTIP_HEIGHT = predicted.height;
      const TOOLTIP_WIDTH = predicted.width;
      const PADDING = 4;
      let position = {};
      switch (placement) {
        case 'top':
          position = { x: ref.left + (ref.width / 2) - (TOOLTIP_WIDTH / 2), y: ref.y - TOOLTIP_HEIGHT - PADDING };
          break;
        case 'left':
          position = { x: ref.left - predicted.width - PADDING, y: (ref.y + (ref.height / 2)) - (TOOLTIP_HEIGHT / 2) };
          break;
        case 'bottom':
          position = { x: ref.left + (ref.width / 2) - (TOOLTIP_WIDTH / 2), y: ref.bottom + PADDING };
          break;
        case 'right':
          position = { x: ref.left + ref.width + PADDING, y: ref.y };
          break;
        default:
          break;
      }
      pseudoTooltip.remove();
      createTooltip({ content, position });
    }

    if (hoverDuration) {
      this.hoverInterval = setTimeout(create, hoverDuration);
    } else {
      create();
    }
  }

  unhover () {
    if (this.hoverInterval) {
      clearTimeout(this.hoverInterval);
    }
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
