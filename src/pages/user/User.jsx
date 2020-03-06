import React from 'react';
import { connect } from 'react-redux';
import { PopletBase, NavBar, Avatar, Flex, FlexChild, MinimalisticButton } from '../../components';
import { getUser } from '../../modules';
import './User.scss';
import { Messages } from '../../i18n';

function mapStateToProps (state, props) {
  return {
    user: state.users.items[props.match ? props.match.params.id : state.user.id],
    currentUser: state.user
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
    const { user = null, currentUser = {} } = this.props;
    if (currentUser === null || user === null) return null;
    const isSelf = user.id === currentUser.id;
    return (
      <div className='poplet-root center-on-page user-profile'>
        <NavBar />
        {(() => {
          if (user) {
            return (
              <Flex className='user-profile-container' align='left' direction='row'>
                <section>
                  <FlexChild grow={0} shrink={0} direction='row' align='center'>
                    <Avatar className='user-profile-avatar' url={user.avatar} alt={user.username} size='large' />
                    <Flex grow={1} direction='row' align='center' className='user-profile-username' style={{ marginLeft: '24px' }}>
                      <FlexChild grow={0} shrink={1} direction='row' align='center'>
                        {user.username}
                      </FlexChild>

                      <FlexChild className='user-profile-send-fr-btn-container' grow={0} shrink={1} direction='row' align='center'>
                        {!isSelf && <div className='user-profile-send-fr-btn btn'>
                          {Messages.SEND_FREIND_REQUEST}
                        </div>}
                        <MinimalisticButton icon='more_vert' color='red' className='user-profile-more-actions-btn' />
                      </FlexChild>
                    </Flex>
                  </FlexChild>

                  <FlexChild className='user-profile-information' grow={0} direction='row' align='center'>
                    <p>{Messages.USER_CREATED} {new Date(user.createdAt).toLocaleDateString()}</p>
                  </FlexChild>
                </section>
              </Flex>
            );
          } else {
            if (user === null) {
              return null;
            } else {
              return <div>{Messages.USER_NOT_FOUND}</div>
            }
          }
        })()}

      </div>
    );
  }
}

export default connect(mapStateToProps, null)(UserComponent);
