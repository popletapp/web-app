import React, { Component } from 'react';
import { joinClasses } from '../../../util';
import { Flex, Button } from './../../';
import SimpleMarkdown from 'simple-markdown';
import './Editor.scss';

const tutorialButton1 = {
  order: SimpleMarkdown.defaultRules.em.order,
  match: (source) => /^<<(TUTORIAL_METHOD_1)>>/.exec(source),
  parse: (capture, parse, state) => ({ content: parse(capture[1], state) }),
  react: (node, output) => (
    <span key={Math.random()} className='toolbar-option-markdown' direction='row' align='center' justify='flex-start'>
      <Button color='purple lighten-2' icon='note_add' className='toolbar-btn' />
      <p>New Note</p>
    </span>
  )
}

const tutorialButton2 = {
  order: SimpleMarkdown.defaultRules.em.order,
  match: (source) => /^<<(TUTORIAL_METHOD_2)>>/.exec(source),
  parse: (capture, parse, state) => ({ content: parse(capture[1], state) }),
  react: (node, output) => (
    <span key={Math.random()} className='toolbar-option-markdown' direction='row' align='center' justify='flex-start'>
      <Button color='purple lighten-1' icon='library_add' className='toolbar-btn' />
      <p>New Group</p>
    </span>
  )
}


const tutorialButton3 = {
  order: SimpleMarkdown.defaultRules.em.order,
  match: (source) => /^<<(TUTORIAL_METHOD_3)>>/.exec(source),
  parse: (capture, parse, state) => ({ content: parse(capture[1], state) }),
  react: (node, output) => <Button key={Math.random()} style={{ marginLeft: '2px', marginRight: '2px', height: '16px', lineHeight: '15px', marginTop: '0', fontSize: '11.5px' }} 
  className='large-invite-members-btn'>Invite Members</Button>
}

const paragraph = {
  ...SimpleMarkdown.defaultRules.paragraph,
  order: 3,
  match: (source) => /^((?:[^\n]|\n(?! *\n))+)(?:\n *)/.exec(source),
  react: (node, output) => <div className='paragraph' key={Math.random()}>{output(node.content)}</div>
}

const newline = {
  ...SimpleMarkdown.defaultRules.newline,
  order: 4,
  match: (source) => /^(.+)\n/.exec(source),
  react: (node, output) => <div className='newline'>{output(node.content)}<br /></div>
}

const CUSTOM_RULES = { ...SimpleMarkdown.defaultRules, tutorialButton1, tutorialButton2, tutorialButton3, paragraph, newline }
const rawParser = SimpleMarkdown.parserFor(CUSTOM_RULES);
const output = SimpleMarkdown.outputFor(CUSTOM_RULES, 'react');

class Editor extends Component {
  constructor ({ type, editing, content, parseMarkdown }) {
    super();
    this.editing = editing;
    this.content = content;
    this.parseMarkdown = parseMarkdown;
    this.type = type;
    this.state = {};
  }

  update (event) {
    if (this.props.onInput) {
      this.props.onInput(event, this.props.type);
    }
  }

  change (event) {
    this.setState({ content: event.target.innerHTML });
  }

  componentDidMount () {
    const content = this.props.children;
    this.setState({ content });
  }

  componentDidUpdate (oldProps) {
    if (oldProps.children !== this.props.children) {
      this.setState({ content: this.props.children });
    }
  }

  render () {
    const { editing = false, parseMarkdown, onClick, className, onBlur, onFocus, onMouseEnter, onMouseLeave, style, placeholder } = this.props;
    const { content } = this.state;

    return (
      <div
        aria-multiline='true'
        role='textbox'
        onClick={onClick}
        spellCheck={false}
        className={joinClasses('editor', className, editing ? '' : 'editor-cursor')}
        onBlur={onBlur}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        contentEditable={editing}
        suppressContentEditableWarning={true}
        style={style}
        placeholder={placeholder}
        onInput={(e) => this.update(e)}
        onChange={(e) => this.change(e)}>
        {parseMarkdown ? output(rawParser(content)) : content}
      </div>
    );
  }
}

export default Editor;
