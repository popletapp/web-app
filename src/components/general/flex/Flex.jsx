import React, { Component } from 'react';
import { joinClasses } from './../../../util';
import './Flex.scss';

class Flex extends Component {
  render () {
    const {
      wrap = false,
      align = 'left',
      basis = 'auto',
      direction = 'column',
      justify = 'start',
      grow = 1,
      shrink = 1,
      className,
      children,
      style,
      onClick
    } = this.props;
    return (
      <div
        style={{ flex: `${grow} ${shrink} ${basis}`, ...style }}
        data-target={this.props['data-target']}
        onClick={onClick}
        className={joinClasses(
          'flex',
          className,
          align ? `align-${align}` : null,
          !wrap ? 'no-wrap' : 'flex-wrap',
          direction === 'row' ? 'direction-row' : 'direction-column',
          justify ? `justify-${justify}` : null
        )}>
        {children}
      </div>
    );
  }
}

export default Flex;
