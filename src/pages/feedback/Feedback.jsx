import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { PopletBase, Avatar, NavBar, Button, MinimalisticButton, Flex, FlexChild } from '../../components';
import './Feedback.scss';
import Poplet from './../../';
import { Messages } from '../../i18n';

function mapStateToProps (state) {
  return {
    boards: state.boards,
    user: state.user
  };
}

class Feedback extends PopletBase {
  constructor () {
    super();
    this.state = {
      what: 0,
      area: {},
      text: '',
      error: null,
      submitted: false
    };
  }

  async componentDidMount () {
    await this.init();
  }

  onBlur (e) {
    this.setState({
      text: e.target.value
    });
  }

  async onSubmit () {
    const { user } = this.props;
    const { area, text, what } = this.state;
    if (!area.id && !what) {
      return this.setState({ error: Messages.FEEDBACK_LOCATION_MISSING });
    }
    if (!text) {
      return this.setState({ error: Messages.FEEDBACK_TYPE_MISSING });
    }

    this.setState({
      submitted: true
    });

    Poplet.ws.emit('feedback', {
      username: what ? 'Feedback' : 'Bug Report',
      content: `**\`${area.friendly || 'Feedback'}\`** from **${user.username || 'Anonymous'}** (${user.id || 'n/a'})\n>>> ${text.length > 1950 ? `${text.slice(0, 1945)}...` : text}`
    });
  }

  render () {
    setTimeout(() => {
      window.M.AutoInit();
    }, 20);
    const { boards, user } = this.props;
    const { what, area, error, submitted } = this.state;

    return (
      <div>
        <NavBar />

        <Flex align='center'>
          <div className='feedback-content-container'>
            <Flex align='left'>
              {(() => {
                if (submitted) {
                  return (
                    <FlexChild>
                      <h2>{Messages.FEEDBACK_THANKS.replace('{0}', (what ? Messages.FEEDBACK : Messages.BUG_REPORT).toLowerCase())}</h2>
                      <h4>{Messages.FEEDBACK_THANKS_DESCRIPTION}</h4>
                      <Link to='/home'>{Messages.FEEDBACK_GO_HOME}</Link>
                    </FlexChild>
                  );
                } else {
                  return (
                    <Flex>
                      <FlexChild className='feedback-choice'>
                        <h2>{Messages.FEEDBACK_REPORTING}</h2>
                        <div className='dropdown-trigger' data-target='what-choice-dropdown'>
                          <Flex align='center' direction='row'>
                            <MinimalisticButton icon='keyboard_arrow_down' color='red' className='board-selector-btn' />
                            <p>{what ? Messages.FEEDBACK : Messages.BUG_REPORT}</p>
                          </Flex>
                        </div>
                      </FlexChild>

                      {!what &&
                      <Flex className='feedback-bug-where'>
                        <FlexChild>
                          <h2>{Messages.FEEDBACK_HAPPENED_WHERE}</h2>
                          <div className='dropdown-trigger' data-target='component-dropdown'>
                            <Flex align='center' direction='row'>
                              <MinimalisticButton icon='keyboard_arrow_down' color='red' className='board-selector-btn' />
                              <p>{area.friendly || Messages.FEEDBACK_CLICK_TO_SELECT}</p>
                            </Flex>
                          </div>
                        </FlexChild>

                        <FlexChild>
                          <h2>{Messages.FEEDBACK_HAPPENED_WHAT.replace('{0}', user.username || 'user')}</h2>
                          <h5 className='feedback-subtext'>{Messages.FEEDBACK_TEXTAREA_SUBTEXT}</h5>
                          <textarea onBlur={(e) => this.onBlur(e)} style={{ maxWidth: '100%', width: '100%', height: '150px', resize: 'none' }}></textarea>
                        </FlexChild>
                      </Flex>}

                      {!!what && <FlexChild className='feedback-general-what'>
                        <h2>{Messages.FEEDBACK_COMMENT_SUBTEXT}</h2>
                        <textarea onBlur={(e) => this.onBlur(e)} style={{ maxWidth: '100%', width: '100%', height: '150px', resize: 'none' }}></textarea>
                      </FlexChild>}
                      <div className='feedback-error'>{error}</div>
                      <Button onClick={() => this.onSubmit()} color='green' style={{ marginTop: '24px' }}>
                        {Messages.SUBMIT}
                      </Button>
                    </Flex>
                  );
                }
              })()}
            </Flex>
          </div>
        </Flex>

        <ul id='what-choice-dropdown' className='dropdown-content'>
          <li onClick={() => this.setState({ what: 0 })}>{Messages.FEEDBACK_BUG_REPORT}</li>
          <li onClick={() => this.setState({ what: 1 })}>{Messages.FEEDBACK_GENERAL_FEEDBACK}</li>
        </ul>

        <ul id='component-dropdown' className='dropdown-content'>
          <li className="feedback-divider feedback-subheader-dropdown" tabIndex="-1">Pages</li>
          <li onClick={(e) => this.setState({ area: { friendly: e.target.innerText, id: 'landing' } })} className='board-item'>{Messages.FEEDBACK_LOCATION_LANDING_PAGE}</li>
          <li onClick={(e) => this.setState({ area: { friendly: e.target.innerText, id: 'home' } })} className='board-item'>{Messages.FEEDBACK_LOCATION_HOME_SCREEN}</li>

          <li className="feedback-divider feedback-subheader-dropdown" tabIndex="-1">Specific Board</li>
          {Object.values(boards).map(board => {
            return (
              <li onClick={() => this.setState({ area: { friendly: `Board - ${board.name} (${board.id})`, id: `board-${board.id}` } })} className='board-item'>
                <Avatar url={board.avatar} alt={board.name} size={32} />
                <div className='board-item-name'>
                  {board.name}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Feedback);
