import React from 'react';
import { connect } from 'react-redux';
import { PopletBase, NavBar, Avatar, Flex, FlexChild } from '../../components';
import { getUser } from '../../modules';
import './User.scss';

function mapStateToProps (state, props) {
  return {
    user: state.users.items.find(user => user.id === props.match ? props.match.params.id : state.user.id)
  };
}

class UserComponent extends PopletBase {
  async componentDidMount () {
    await this.init();
    if (!this.props.user) {
      const userID = this.props.match.params.id;
      await getUser(userID);
    }
  }

  render () {
    const { user } = this.props;
    return (
      <div className='poplet-root center-on-page user-profile'>
        <NavBar />

        {(() => {
          if (user) {
            return (
              <Flex className='user-profile-container' align='left' direction='row'>
                <FlexChild grow={0} direction='row' align='center'>
                  <Avatar url={user.avatar} alt={user.username} size='large' />
                  <FlexChild grow={0} align='center' className='user-profile-username' style={{ marginLeft: '24px' }}>
                    {user.username}
                  </FlexChild>
                </FlexChild>
              </Flex>
            );
          } else {
            return (
              <div>
                That actually doesn't appear to be a user...
              </div>
            );
          }
        })()}

      </div>
    );
  }
}

export default connect(mapStateToProps, null)(UserComponent);
