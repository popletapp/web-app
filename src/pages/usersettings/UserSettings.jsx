import React from 'react';
import { connect } from 'react-redux';
import { PopletBase, NavBar, Avatar, Flex, FlexChild, ToggleSwitch } from '../../components';
import { Link } from 'react-router-dom';
import { getUser } from '../../modules';
import './UserSettings.scss';
import { USER_SETTINGS_CATEGORIES } from './../../constants/Categories';
import { UserSettingsGeneral, UserSettingsAppearance, UserSettingsLanguage } from './index';
import { withTranslation } from 'react-i18next';

function mapStateToProps (state, props) {
  return {
    user: state.user
  };
}

const TABS = {
  GENERAL: UserSettingsGeneral,
  APPEARANCE: UserSettingsAppearance,
  LANGUAGE: UserSettingsLanguage
}

class UserSettings extends PopletBase {
  constructor () {
    super();
    this.state = {
      selectedTab: USER_SETTINGS_CATEGORIES.GENERAL
    }
  }

  async componentDidMount () {
    await this.init();
  }

  navChange (event) {
    if (event.target.localName !== 'li') return;
    const parent = event.target.parentElement;
    for (const link of [ ...parent.children ]) {
      link.removeAttribute('active')
    }
    event.target.setAttribute('active', true)
    this.setState({ selectedTab: event.target.dataset.tab.toUpperCase() });
  }

  render () {
    const { user = null, t } = this.props;
    const { selectedTab } = this.state;
    const normalTabName = t(`USER_SETTINGS_CATEGORY_${selectedTab}`);
    let Category = TABS[selectedTab];
    if (!Category) {
      Category = () => 
      <Flex direction='column' className='user-settings-content'>
        <h1>{t("COMING_SOON")}</h1>
        <hr></hr>

        <FlexChild direction='row' grow={0} className='user-settings-setting'>
          <header className='user-settings-header'>
            {t("USER_SETTINGS_NOT_READY")}
          </header>
        </FlexChild>
      </Flex>
    }

    return (
      <div className='poplet-root center-on-page user-settings'>
        <NavBar />
        {(() => {
          if (user) {
            return (
              <Flex className='user-settings-container' grow={0} shrink={1} align='left' direction='row'>
                <section>
                  <FlexChild className='user-settings-nav' grow={0} shrink={1} direction='row' align='center'>
                    <Avatar id={user.id} className='user-settings-avatar' url={user.avatar} alt={user.username} size='small' />
                    <Flex grow={1} direction='row' align='center' className='user-settings-nav-text' style={{ marginLeft: '24px' }}>
                      <FlexChild grow={0} shrink={1} direction='row' align='center'>
                        <Link to={`/users/${user.id}`}>{user.username}</Link> 
                        <span className='user-settings-arrow'> → </span> 
                        <Link to='/settings'>{t("SETTINGS")}</Link>
                        <span className='user-settings-arrow'> → </span> 
                        <Link to='/settings'>{normalTabName}</Link>
                      </FlexChild>
                    </Flex>
                  </FlexChild>

                  <Flex direction='row'>
                    <FlexChild className='user-settings-nav-vert' grow={1} shrink={0}>
                      <ul onClick={(e) => this.navChange(e)}>
                        <li data-tab='General' active='true'>{t("USER_SETTINGS_CATEGORY_GENERAL")}</li>
                        <li data-tab='Appearance'>{t("USER_SETTINGS_CATEGORY_APPEARANCE")}</li>
                        <li data-tab='Notifications'>{t("USER_SETTINGS_CATEGORY_NOTIFICATIONS")}</li>
                        <li data-tab='Privacy'>{t("USER_SETTINGS_CATEGORY_PRIVACY")}</li>
                        <li data-tab='Security'>{t("USER_SETTINGS_CATEGORY_SECURITY")}</li>
                        <li data-tab='Language'>{t("USER_SETTINGS_CATEGORY_LANGUAGE")}</li>
                      </ul>
                    </FlexChild>

                    <Category />
                  </Flex>
                </section>
              </Flex>
            );
          } else {
            if (user === null) {
              return null;
            } else {
              return <div>{t("USER_SETTINGS_INACCESSIBLE")}</div>
            }
          }
        })()}

      </div>
    );
  }
}

export default withTranslation()(connect(mapStateToProps, null)(UserSettings));
