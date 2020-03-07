import React, { Component } from 'react';
import './ContextMenu.scss';
import { Flex } from '../../';
import { removeContextMenu } from './../../../modules';
import { findAncestor } from './../../../util'

class ContextMenuItem extends Component {
  onClick (event) {
    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick();
    }
    this.actionMade('item', event);
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

  close () {
    const { onClose = () => void 0 } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
    removeContextMenu();
  }

  render () {
    const { name, type, icon, onClick } = this.props;
    return (
      <Flex className='contextmenu-item' direction='row' onClick={(e) => this.onClick(e)}>
        {(() => {
          if (type === 'submenu') {
            
          } else {
            return (
              <div>{name}</div>
            )
          }
        })()}
      </Flex>
    )
  }
}

class ContextMenu extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isShowing: false
    };

    this.createdAt = Date.now();
    this.escListener = (e) => e.keyCode === 27 && this.actionMade('cancel', e);
    this.clickListener = (event) => {
      let el = event.target;
      el = findAncestor(el, 'contextmenu');
      if (!el) {
        this.close();
      }
    };
  }

  close () {
    const { onClose = () => void 0 } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
    this.unsubscribe();
    removeContextMenu();
  }

  componentDidMount () {
    window.listeners.subscribe('keydown', this.escListener, false);
    window.listeners.subscribe('mouseup', this.clickListener, false);
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  unsubscribe () {
    window.listeners.unsubscribe('keydown', this.escListener, false);
    window.listeners.unsubscribe('mouseup', this.clickListener, false);
  }

  render () {
    const { items, style } = this.props;
    return (
      <Flex style={style} className='contextmenu'>
        {items.map((item) => (
          <ContextMenuItem name={item.name} icon={item.icon} onClick={item.onClick} />
        ))}
      </Flex>
    )
  }
}

export default ContextMenu;