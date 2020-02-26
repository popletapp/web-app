import React, { Component } from 'react';
import { SelectableItem, ToggleSwitch, List, DefaultInput, CloseButton, Flex, FlexChild, User, Scroller, DatePicker } from '../..';
import { connect } from 'react-redux';
import './NoteSettingsScreen.scss';
import RULESETS from '../../../constants/Rulesets';

const BASE_RULE = {
  id: 0,
  name: 'Basic rule', // name
  position: 0, // determines what order rules should be executed in
  instructions: 0x0
}

function mapStateToProps (state) {
  return {
    compact: false,
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
          <option value='assign-members'>assign these members</option>
          <option value='set-title'>set the title to</option>
          <option value='add-content-title'>add content to the notes title</option>
          <option value='add-content-desc'>add content to the note</option>
          <option value='replace-content'>replace the content of the note</option>
          <option value='add-due-date'>add a due date</option>
          <option value='set-importance'>mark as important</option>
          <option value='announce-content'>announce content</option>
          <option value='send-notif'>send a notification</option>
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
        <span className='performable-creation-text-add'>and...</span>
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
          <span className='rule-creation-header' style={{ marginRight: '12px' }}>Rule</span> <DefaultInput placeholder={rule.name || index.toString()}></DefaultInput>
        </Flex>
        <div className='board-note-settings-midheader'>
          When <b>
            <select onChange={(e) => this.handleActionTypeSelect(e)}>
              <option value='new-note'>a new</option>
              <option value='existing-note'>an existing</option>
            </select>
          </b> note is...
          <select onChange={(e) => this.handleActionTypeSelect(e)}>
            {!existingSelected ? <option value={rule.NOTE_CREATED} value='created'>created</option> : null}
            {existingSelected ? <option value={rule.NOTE_EDITED} value='edited'>edited</option> : null}
            {existingSelected ? <option value={rule.NOTE_DELETED} value='deleted'>deleted</option> : null}
          </select>
        </div>
        
        <Flex direction='column'>
          <Flex direction='row' grow={0} className='board-settings-subheader'>
            Performables
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

  render () {
    let { compact } = this.props;
    let { rules } = this.state;

    return (
      <Flex direction='column' align='left' className='board-settings-content-container'>
        <div className='board-settings-header'>
          Notes
        </div>
        <div className='board-settings-text'>
          Adjust how notes look and perform actions on certain events
        </div>

        <Flex direction='row' grow={0} className='board-settings-subheader'>
          Compact Mode
          <ToggleSwitch initialState={compact} small={true} style={{ marginLeft: '24px' }} />
        </Flex>
        Makes notes take up less space on the screen and displays less information

        <Flex direction='row' grow={0} className='board-settings-subheader'>
          Action Types
        </Flex>

        <List style={{ height: 'auto', maxHeight: '50%', paddingRight: '12px' }}>
          <Scroller>
            {!rules.length && <div>No note rules</div>}
            {rules.length && rules.map((rule, i) => <Rule index={i} key={i} rule={rule} />)}
          </Scroller>
        </List>
        <div style={{ marginTop: '12px' }} className='btn' onClick={() => this.createRule()}>New Rule</div>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(NoteSettingsScreen);
