import React, { Component } from 'react';
import Markdown from 'react-markdown';

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
    this.setState({ content: event.target.value });
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
    const { editing, parseMarkdown } = this.props;
    const { content } = this.state;
    const dontInclude = ['parseMarkdown', 'editing'];

    return (
      <div {...Object.fromEntries(Object.entries(this.props).filter(item => !dontInclude.includes(item[0])))}
        contentEditable={editing.toString()}
        suppressContentEditableWarning={true}
        onInput={(e) => this.update(e)}
        onChange={(e) => this.change(e)}>
        {parseMarkdown ? <Markdown source={content} /> : content}
      </div>
    );
  }
}

export default Editor;
