import React, { Component } from 'react';
import { joinClasses } from '../../../util';
import SimpleMarkdown from 'simple-markdown';
import './Editor.scss';

const mdParse = SimpleMarkdown.defaultBlockParse;
const mdOutput = SimpleMarkdown.defaultReactOutput;

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
    const { editing, parseMarkdown, onClick, className, onBlur, onFocus, onMouseEnter, onMouseLeave, style, placeholder } = this.props;
    const { content } = this.state;
    if (!content) return null;

    return (
      <div
        aria-multiline='true'
        role='textbox'
        onClick={onClick}
        className={joinClasses('editor', className, editing ? '' : 'editor-cursor')}
        onBlur={onBlur}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        contentEditable={editing.toString()}
        suppressContentEditableWarning={true}
        style={style}
        placeholder={placeholder}
        onInput={(e) => this.update(e)}
        onChange={(e) => this.change(e)}>
        {parseMarkdown ? mdOutput(mdParse(content)) : content}
      </div>
    );
  }
}

export default Editor;
