import React, { Component } from 'react';
import { Flex } from '../../';
import { joinClasses } from '../../../util';

class LazyLoaderScroller extends Component {
  onScroll (event) {
    const container = event.target;
    if (container.clientHeight * 1.5 > container.scrollHeight - container.scrollTop) {
      this.triggerLazyLoad();
    }
  }

  triggerLazyLoad () {
    const { onLoad } = this.props;
    console.log('Triggering lazy load')
    if (onLoad && typeof onLoad === 'function') {
      onLoad();
    }
  }

  render () {
    const { className, children, style } = this.props;
    return (
      <Flex style={style} className='scroller-container'>
        <div onScroll={(e) => this.onScroll(e)} className={joinClasses('scroller', className)}>
          {children}
        </div>
        <Flex align='center' justify='center'>
          <a onClick={() => this.triggerLazyLoad()}>Load more...</a>
        </Flex>
      </Flex>
    );
  }
}

export default LazyLoaderScroller;
