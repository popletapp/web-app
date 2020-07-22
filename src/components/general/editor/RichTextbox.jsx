import React, { Component } from 'react';
import { Editor, Button } from './../../';
import SimpleMarkdown from 'simple-markdown';
import { joinClasses } from '../../../util';

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


const CUSTOM_RULES = {
  ...SimpleMarkdown.defaultRules,
  // Remove newline before ending header
  heading: {
    ...SimpleMarkdown.defaultRules.heading,
    match: (source) => /^ *(#{1,6})([^\n]+?)#* *(?:\n *)+/.exec(source)
  }
}

const rawParser = SimpleMarkdown.parserFor(CUSTOM_RULES);
const parse = function(source) {
  const blockSource = source;
  return rawParser(blockSource, { inline: true });
};
const output = SimpleMarkdown.outputFor(CUSTOM_RULES, 'react');

class RichTextbox extends Component {
  constructor (props) {
    super(props);
    this.state = {
      content: props.children
    }
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
    const { children, editable, parseMarkdown = true, className, style, onClick, onBlur, onFocus, onMouseEnter, onMouseLeave,
      placeholder, doDecorate, onChange } = this.props;
    let { content } = this.state;
    const parsed = output(parse(content))

    const properties = editable ? {
      className,
      doDecorate,
      parseMarkdown,
      style,
      onClick,
      onBlur,
      onFocus,
      onChange,
      onMouseEnter,
      onMouseLeave,
      placeholder
    } : {
      className,
      style,
      onClick,
      onBlur,
      onFocus,
      onChange,
      onMouseEnter,
      onMouseLeave,
      placeholder
    };
    return !editable ? <div {...properties} className={joinClasses('content', className)}>{parsed}</div> : <Editor {...properties} className={joinClasses('content', className)}>{children}</Editor>
  }
}

export default RichTextbox;