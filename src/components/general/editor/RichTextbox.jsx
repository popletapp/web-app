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

  return <Editor readOnly={!editable} {...properties}>{content}</Editor>
}

export default RichTextbox;