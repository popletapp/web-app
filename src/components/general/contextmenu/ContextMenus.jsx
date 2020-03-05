import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ContextMenu } from '../..';

function mapStateToProps (state) {
  return {
    contextmenus: state.contextmenus
  };
}

class ContextMenus extends Component {
  render () {
    const { contextmenus, className } = this.props;
    return (
      <div className='popouts animated'>
        {contextmenus.map((contextmenu, i) => 
          <ContextMenu 
            items={contextmenu.items}
            style={{ top: contextmenu.position.y, left: contextmenu.position.x }} 
            key={i}>
          </ContextMenu>)
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(ContextMenus);
