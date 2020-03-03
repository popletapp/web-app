import React from 'react';
import { Editor } from './../../';

const RichTextbox = (props) => {
  const { children: content, editable, parseMarkdown = true, className, style, onClick, onBlur, onFocus, onMouseEnter, onMouseLeave,
    placeholder, doDecorate } = props;
  const properties = {
    className,
    doDecorate,
    parseMarkdown,
    style,
    onClick,
    onBlur,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    placeholder
  }

  if (props.parseMarkdown) console.log("!!! parseMarkdown is TRUE YAY")
  return <Editor readOnly={!editable} {...properties}>{content}</Editor>
}

// class RichTextBox extends React.Component {
//   constructor(props) {
//     super(props);
    
//   }

//   componentDidUpdate (oldProps, oldState) {
//     console.log(newProps, old)
//   }

//   render() {
//     return <Editor readOnly={!this.state.editable} {...this.state.properties} />
//   }
// }

export default RichTextbox;