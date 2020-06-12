import React, { Component } from 'react';
import Popout from './Popout';
import { Flex, FlexChild, Avatar } from '../..';
import { getNotifications } from '../../../modules';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import './NotificationListPopout.scss';

function mapStateToProps (state) {
  return {
    users: state.users.items
  }
}

class Notification extends Component {
  render () {
    const { users, notification } = this.props;
    const { title, content, author, timestamp } = notification;
    const user = users[author];
    return (
      <Flex direction='row' className='notification'>
        {user && <Avatar className='notification-avatar' id={user.id} url={user.avatar} alt={user.username}></Avatar>}
        {!user && <Avatar className='notification-avatar' id='0' url={`./../../assets/icons/poplet.svg`} alt='Poplet'></Avatar>}
        <FlexChild>
          <Flex direction='row' align='center' className='notification-title'>
            <FlexChild align='left' className='notification-title-content'>{title}</FlexChild>
            <FlexChild align='right' className='notification-timestamp'>{new Date(timestamp).toDateString()}</FlexChild>
          </Flex>
          {content && <div className='notification-content'>{content}</div>}
        </FlexChild>
      </Flex>
    );
  }
}

const ConnectedNotification = connect(mapStateToProps, null)(Notification);


class NotificationListPopout extends Popout {
  constructor () {
    super();
    this.exclude = [];
    this.state = {
      notifications: null
    }
  }

  selectionMade (elm) {
    const { onOptionSelected = () => void 0 } = this.props;
    onOptionSelected(elm);
    // Solution to remove the item from the list immediately -
    // this is fine because we never need to add it back and the popout will just die
    this.exclude.push(elm);
    this.updateSelf();
  }

  async componentDidMount () {
    this.setState({
      notifications: await getNotifications()
    });
  }

  content () {
    let { exclude = [], noElementsText, t } = this.props;
    let { notifications = [] } = this.state;
    notifications = [
      {
        title: 'Test Notification',
        content: 'This is a test notification to test the notifications system.',
        timestamp: Date.now()
      },
      {
        title: 'Nevulo sent you a friend request',
        author: '24251582890',
        type: 'FRIEND_REQUEST',
        timestamp: Date.now()
      }
    ]
    if (this.exclude) {
      exclude = exclude.concat(this.exclude);
    }
    console.log(notifications)

    return (
      <Flex className='popout'>
        <FlexChild className='popout-content'>
          <div className='popout-list-header notification-list-header'>
            <i className='material-icons notification-list-header-icon'>notifications</i> {t("POPOUT_NOTIFICATIONS_TITLE")}
          </div>

          <Flex className='popout-list-elements' direction='column' align='flex-start'>
            {notifications.filter(elm => !exclude.includes(elm))
            .map(notification => <ConnectedNotification notification={notification} />)}
            {notifications.length === 0 && <div className='notification-list-no-notifications'>{noElementsText || t("POPOUT_NOTIFICATIONS_NO_NOTIFICATIONS")}</div>}
          </Flex>
        </FlexChild>
      </Flex>
    );
  }
}

export default withTranslation()(NotificationListPopout);
