import React from 'react';
import Poplet from './../../index';
import { connect } from 'react-redux';
import { PopletBase, NavBar, Avatar, Flex, FlexChild, MinimalisticButton } from '../../components';
import { getUser, sendFriendRequest } from '../../modules';
import './User.scss';
import { withTranslation } from 'react-i18next';

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

  async createFriendRequest () {
    Poplet.log.prefix(Poplet.log.PREFIX_TYPES.NETWORK).info(`Sending friend request to ${this.props.user.id}`)
    await sendFriendRequest(this.props.user.id);
  }

  render () {
    const { user = null, currentUser = {}, t } = this.props;
    if (currentUser === null || user === null) return null;
    const isSelf = user.id === currentUser.id;
    return (
      <div className='poplet-root center-on-page user-profile'>
        <NavBar />
        {(() => {
          if (user) {
            return (
              <Flex className='user-profile-container' justify='center' direction='row'>
                <section>
                  <FlexChild className='user-profile-intro-content' grow={0} shrink={0} direction='column' justify='center' align='center'>
                    
                    <Flex grow={1} direction='row' align='center' className='user-profile-username'>
                      <Avatar className='user-profile-avatar' id={user.id} url={user.avatar} alt={user.username} size='large' />
                      <FlexChild className='user-profile-username-text' grow={0} shrink={1} direction='row' align='center'>
                        {user.username}
                      </FlexChild>
                    </Flex>

                    <FlexChild className='user-profile-send-fr-btn-container' grow={0} shrink={1} direction='row' align='center'>
                      {!isSelf && <Flex onClick={() => this.createFriendRequest()} className='user-profile-send-fr-btn btn' align='center' direction='row'>
                        <i className='material-icons'>person_add</i>
                        <span>{t("SEND_FRIEND_REQUEST")}</span>
                      </Flex>}
                      <MinimalisticButton icon='more_vert' color='red' className='user-profile-more-actions-btn' />
                    </FlexChild>

                    <FlexChild className='user-profile-information' grow={0} direction='row' justify='center' align='center'>
                      <p>{t("USER_CREATED")} {new Date(user.createdAt).toLocaleDateString()}</p>
                    </FlexChild>
                  </FlexChild>

                  
                </section>
              </Flex>
            );
          } else {
            if (user === null) {
              return null;
            } else {
              return <div>{t("USER_NOT_FOUND")}</div>
            }
          }
        })()}

      </div>
    );
  }
}

export default withTranslation()(connect(mapStateToProps, null)(UserComponent));
