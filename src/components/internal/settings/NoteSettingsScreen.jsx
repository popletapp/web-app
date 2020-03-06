import React, { Component } from 'react';
import { SelectableItem, ToggleSwitch, List, DefaultInput, CloseButton, Flex, FlexChild, User, Scroller, DatePicker } from '../..';
import { connect } from 'react-redux';
import { updateBoard } from './../../../modules';
import './NoteSettingsScreen.scss';
import RULESETS from '../../../constants/Rulesets';
import { Messages } from '../../../i18n';

const BASE_RULE = {
  id: 0,
  name: 'Basic rule', // name
  position: 0, // determines what order rules should be executed in
  instructions: 0x0
}

function mapStateToProps (state) {
  return {
    board: state.boards[state.selectedBoard],
    members: Object.values(state.membersByBoard[state.selectedBoard])
  };
}

function UserPanel (props) {
  const [users, setUsers] = React.useState(props.members);
  return (
    <List style={{ maxHeight: '300px' }}>
      <Scroller>
        {users.map((user, i) =>
          <SelectableItem key={i} className='user-item' id={user.id} selected={false}>
            <Flex align='left' basis='auto' grow={1} shrink={1}>
              <FlexChild align='left' direction='row' basis='auto' grow={1} shrink={1}>
                <User avatar={user.avatar} username={user.username} />
              </FlexChild>
            </Flex>
          </SelectableItem>)}
      </Scroller>
    </List>
  )
}
const ConnectedUserPanel = connect(mapStateToProps, null)(UserPanel);

// Use a bitfield to define the type of rule (what attributes/performables it has)
// Provide an extra object with the rule for extra stuff (content, members, etc)

// A maximum of 5 performables per rule
// Maximum of 5 rules
function Performable () {
  const [value, setValue] = React.useState('assign-members');
  const [removed, isRemoved] = React.useState(false);
  const [options, setOptions] = React.useState({});

  const key = Math.random() * 1e5;
  const selectionHandler = (e) => setValue(e.target.value);

  return removed ? null : (
    <Flex direction='column' key={key} grow={1} align='left'>
      <Flex direction='row' grow={1} align='center'>
        <select value={value} onChange={(e) => selectionHandler(e)}>
          <option value='assign-members'>{Messages.BOARD_SETTINGS_NOTES_PERFORMABLES_ASSIGN_MEMBERS}</option>
          <option value='set-title'>{Messages.BOARD_SETTINGS_NOTES_PERFORMABLES_SET_TITLE}</option>
          <option value='add-content-title'>{Messages.BOARD_SETTINGS_NOTES_PERFORMABLES_ADD_CONTENT_TITLE}</option>
          <option value='add-content-desc'>{Messages.BOARD_SETTINGS_NOTES_PERFORMABLES_ADD_CONTENT_DESCRIPTION}</option>
          <option value='replace-content'>{Messages.BOARD_SETTINGS_NOTES_PERFORMABLES_REPLACE_CONTENT}</option>
          <option value='add-due-date'>{Messages.BOARD_SETTINGS_NOTES_PERFORMABLES_ADD_DUE_DATE}</option>
          <option value='set-importance'>{Messages.BOARD_SETTINGS_NOTES_PERFORMABLES_SET_IMPORTANCE}</option>
          <option value='announce-content'>{Messages.BOARD_SETTINGS_NOTES_PERFORMABLES_ANNOUNCE_CONTENT}</option>
          <option value='send-notif'>{Messages.BOARD_SETTINGS_NOTES_PERFORMABLES_SEND_NOTIFICATION}</option>
        </select>
        <CloseButton onClick={() => isRemoved(true)} />
      </Flex>
      <div className='performable-custom-content'>
        {/* Performable specific rendering */
        (() => {
          switch (value) {
            case 'assign-members': {
              return <ConnectedUserPanel />
            }
            case 'set-title': {
              return <DefaultInput placeholder='Title' onChange={(e) => setOptions({ type: value, title: e.target.value })} />
            }
            case 'add-content-title': {
              return <DefaultInput onChange={(e) => setOptions({ type: value, content: e.target.value })} />
            }
            case 'add-content-desc': {
              return <DefaultInput onChange={(e) => setOptions({ type: value, content: e.target.value })} />
            }
            case 'replace-content': {
              return <DefaultInput onChange={(e) => setOptions({ type: value, content: e.target.value })} />
            }
            case 'add-due-date': {
              return <DatePicker initial={options.type === 'add-due-date' ? options.value : null} onChange={(date) => setOptions({ type: value, value: date })} />
            }
            case 'set-importance': {
              return null;
            }
            case 'announce-content': {
              return <DefaultInput onChange={(e) => setOptions({ type: value, content: e.target.value })} />
            }
            case 'send-notif': {
              return <DefaultInput onChange={(e) => setOptions({ type: value, content: e.target.value })} />
            }
            default: {
              return null;
            }
          }
        })()}
      </div>
      <br />
    </Flex>
  );
}

class PerformableGroup extends Component {
  constructor (props) {
    super(props);
    this.state = {
      performables: []
    }
  }

  addPerformable () {
    const { onChange = () => void 0 } = this.props;
    if (onChange) {
      onChange();
    }

    let { performables } = this.state;
    performables.push(<Performable />);
    this.setState({ performables });
  }

  handlePerformableSelect (event) {
    const PERFORMABLE_TYPES = {
      'assign-members': RULESETS.ASSIGN_MEMBERS,
      'set-title': RULESETS.SET_TITLE,
      'add-content-title': RULESETS.ADD_CONTENT_TITLE,
      'add-content-desc': RULESETS.ADD_CONTENT_NOTE,
      'replace-content': RULESETS.REPLACE_CONTENT,
      'add-due-date': RULESETS.ADD_DUE_DATE,
      'set-importance': RULESETS.SET_IMPORTANCE_LEVEL,
      'announce-content': RULESETS.ANNOUNCE_CONTENT,
      'send-notif': RULESETS.SEND_NOTIFICATION
    }
  }

  render () {
    const NewPerformableButton = () => <div key={Math.random() * 100} onClick={(e) => this.addPerformable()} className='performable-create-btn'>+</div>;
    this.state.performables = this.state.performables.filter(Boolean);
    const { performables } = this.state;
    
    return performables.length ? <Flex direction='column'>
      <FlexChild direction='column' align='center' justify='center'>
        {performables}
      </FlexChild>
      <FlexChild className='performable-creation-section' direction='row'>
        <span className='performable-creation-text-add'>{Messages.BOARD_SETTINGS_NOTES_AND}</span>
        <NewPerformableButton />
      </FlexChild>
    </Flex> : <NewPerformableButton />
  }
}
const ConnectedPerformableGroup = connect(mapStateToProps, null)(PerformableGroup);

class Rule extends Component {
  constructor (props) {
    super(props);
    this.state = {
      existingSelected: false
    }
  }

  initialize () {
    const { rule } = this.props;
    const has = {};
    this.bitfield = 0;
    for (const permission in RULESETS) {
      has[permission] = has[RULESETS[permission]] = (this.bitfield & permission) === this.bitfield;
    }
    return has;
  }

  handleActionTypeSelect (event) {
    switch (event.target.value) {
      case 'existing-note': {
        this.setState({ existingSelected: true });
        break;
      }
      case 'new-note': {
        this.setState({ existingSelected: false });
        break;
      }
      case 'created': {
        this.bitfield |= RULESETS.NOTE_CREATED;
        this.bitfield &= ~RULESETS.NOTE_EDITED;
        this.bitfield &= ~RULESETS.NOTE_DELETED;
        break;
      }
      case 'edited': {
        this.bitfield &= ~RULESETS.NOTE_CREATED;
        this.bitfield &= ~RULESETS.NOTE_DELETED;
        this.bitfield |= RULESETS.NOTE_EDITED;
      }
      case 'deleted': {
        this.bitfield &= ~RULESETS.NOTE_CREATED;
        this.bitfield &= ~RULESETS.NOTE_EDITED;
        this.bitfield |= RULESETS.NOTE_DELETED;
        break;
      }
      default: {
        this.setState({ existingSelected: false });
        break;
      }
    }
  }

  render () {
    const { index = 0 } = this.props;
    const { existingSelected } = this.state;
    const rule = this.initialize();
    const performableMenu = React.createElement(ConnectedPerformableGroup, { onChange: () => this.forceUpdate() })

    return (<div>
      <div className='rule-creating'>
        <Flex align='center' direction='row'>
          <span className='rule-creation-header' style={{ marginRight: '12px' }}>{Messages.BOARD_SETTINGS_NOTES_RULE}</span> <DefaultInput placeholder={rule.name || index.toString()}></DefaultInput>
        </Flex>
        <div className='board-note-settings-midheader'>
          {Messages.BOARD_SETTINGS_NOTE_PERFORMABLES_WHEN} <b>
            <select onChange={(e) => this.handleActionTypeSelect(e)}>
              <option value='new-note'>{Messages.BOARD_SETTINGS_NOTE_PERFORMABLES_NEW}</option>
              <option value='existing-note'>{Messages.BOARD_SETTINGS_NOTE_PERFORMABLES_EXISTING}</option>
            </select>
          </b> {Messages.BOARD_SETTINGS_NOTE_PERFORMABLES_TARGET_NOTE}
          <select onChange={(e) => this.handleActionTypeSelect(e)}>
            {!existingSelected ? <option value={rule.NOTE_CREATED} value='created'>{Messages.BOARD_SETTINGS_NOTE_PERFORMABLES_NOTE_CREATED}</option> : null}
            {existingSelected ? <option value={rule.NOTE_EDITED} value='edited'>{Messages.BOARD_SETTINGS_NOTE_PERFORMABLES_NOTE_EDITED}</option> : null}
            {existingSelected ? <option value={rule.NOTE_DELETED} value='deleted'>{Messages.BOARD_SETTINGS_NOTE_PERFORMABLES_NOTE_DELETED}</option> : null}
          </select>
        </div>
        
        <Flex direction='column'>
          <Flex direction='row' grow={0} className='board-settings-subheader'>
            {Messages.BOARD_SETTINGS_NOTES_PERFORMABLES}
          </Flex>
          {performableMenu}
        </Flex>
      </div>
    </div>);
  }
}

class NoteSettingsScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      rules: [
        // Basic rule object
        BASE_RULE
      ]
    }
  }

  createRule (options = BASE_RULE) {
    const { rules } = this.state;
    const { name, position, instructions } = options;
    const newRule = BASE_RULE;
    newRule.position = Math.max(...rules.map(o => o.y), 0) + 1;
    newRule.name = name;
    newRule.instructions = instructions;
    rules.push(newRule)
    this.forceUpdate();
    console.log(rules)
  }

  modifyRule (key, value) {

  }

  async updateBoardCompact (compact) {
    let { board } = this.props;
    board = { ...board, compact };
    await updateBoard(board.id, board);
  }

  render () {
    let { board } = this.props;
    let { rules } = this.state;
    const { compact = false } = board;

    return (
      <Flex direction='column' align='left' className='board-settings-content-container'>
        <div className='board-settings-header'>
          {Messages.BOARD_SETTINGS_CATEGORY_NOTES_TITLE}
        </div>
        <div className='board-settings-text'>
          {Messages.BOARD_SETTINGS_CATEGORY_NOTES_DESCRIPTION}
        </div>

        <Flex direction='row' grow={0} className='board-settings-subheader'>
          {Messages.BOARD_SETTINGS_CATEGORY_NOTES_COMPACT_MODE}
          <ToggleSwitch onChange={(compact) => this.updateBoardCompact(compact)} initialState={compact} small={true} style={{ marginLeft: '24px' }} />
        </Flex>
        {Messages.BOARD_SETTINGS_CATEGORY_NOTES_COMPACT_MODE_DESCRIPTION}

        <Flex direction='row' grow={0} className='board-settings-subheader'>
          {Messages.BOARD_SETTINGS_NOTES_ACTION_TYPES}
        </Flex>

        <List style={{ height: 'auto', maxHeight: '50%', paddingRight: '12px' }}>
          <Scroller>
            {!rules.length && <div>{Messages.BOARD_SETTINGS_NOTES_NO_NOTE_RULES}</div>}
            {rules.length && rules.map((rule, i) => <Rule index={i} key={i} rule={rule} />)}
          </Scroller>
        </List>
        <div style={{ marginTop: '12px' }} className='btn' onClick={() => this.createRule()}>{Messages.BOARD_SETTINGS_NOTES_NEW_RULE}</div>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(NoteSettingsScreen);
