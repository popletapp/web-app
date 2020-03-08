import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Flex, FlexChild, Checkbox } from '../../components';
import { updateUser } from '../../modules';
import { withTranslation } from 'react-i18next';
import path from 'path';

function mapStateToProps (state, props) {
  return {
    user: state.user
  };
}

const LANGUAGES = [
  { name: 'English', friendly: 'English', code: 'en' },
  { name: 'Vietnamese', friendly: 'Tiếng Việt', code: 'vi' },
  { name: 'Portuguese (Brazilian)', friendly: 'Português (Brasil)', code: 'pt_BR' },
  { name: 'Russian', friendly: 'Русский', code: 'ru' }
]

class UserSettingsLanguage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      lang: props.user.lang
    }
  }

  async changeLanguage (val) {
    const { user, i18n } = this.props;
    i18n.changeLanguage(val)
    user.lang = val;
    await updateUser(user);
  }

  render () {
    const { t, user, i18n } = this.props;
    const languageStrings = i18n.store.data;
    const TOTAL_STRING_COUNT = Object.keys(languageStrings.en.translation).length;
    return (
      <FlexChild direction='column' className='user-settings-content'>
        <h1>{t("SETTINGS")}</h1>
        <hr></hr>

        <Flex direction='column' grow={0} className='user-settings-setting'>
          <FlexChild direction='column'>
            <header className='user-settings-header'>
              {t("USER_SETTINGS_CATEGORY_LANGUAGE")}
            </header>
          </FlexChild>
          
          <FlexChild className='user-settings-language-container'>
            {LANGUAGES.map((language, i) => {
              if (languageStrings[language.code]) {
                const percentage = Math.floor(Object.keys(languageStrings[language.code].translation || {}).length / TOTAL_STRING_COUNT * 100);
                return (
                  <Flex key={i} direction='row' align='center' className='user-settings-language-option'>
                    <FlexChild direction='row'>
                      <Checkbox initialState={user.lang === language.code} checked={user.lang === language.code} 
                      radio onClick={() => this.changeLanguage(language.code)} label={language.friendly} />
                    </FlexChild>
                    <FlexChild align='center'>
                      <div className='user-settings-language-option-translationpercentage'>
                        {t('USER_SETTINGS_LANGUAGE_TRANSLATION_PERCENTAGE', { percentage })}  
                      </div>
                    </FlexChild>
                  </Flex>
                )
              } else {
                return null;
              }
            })}
          </FlexChild>
        </Flex>
      </FlexChild>
    )
  }
}

export default withTranslation()(connect(mapStateToProps, null)(UserSettingsLanguage));
