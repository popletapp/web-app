import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { joinClasses } from '../../../util';
import Prism from 'prismjs';
import './Editor.scss';
import { connect } from 'react-redux';
import { Editor as SlateEditor, Text, createEditor, Transforms, Range, Node } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { css } from 'emotion';
import { Mention, Flex } from '../..';

function mapStateToProps (state) {
  return {
    users: state.users.items,
    members: state.members
  };
}

// eslint-disable-next-line
Prism.languages.markdown = Prism.languages.extend("markup", {}),
Prism.languages.insertBefore("markdown", "prolog", {
    blockquote: {
      pattern: /^>(?:[\t ]*>)*/m,
      alias: "punctuation"
    },
    code: [{
      pattern: /^(?: {4}|\t).+/m,
      alias: "keyword"
    }, {
      pattern: /``.+?``|`[^`\n]+`/,
      alias: "keyword"
    }],
    title: [{
      pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
      alias: "important",
      inside: {
        punctuation: /==+$|--+$/
      }
    }, {
      pattern: /(^\s*)#+.+/m,
      lookbehind: !0,
      alias: "important",
      inside: {
        punctuation: /^#+|#+$/
      }
    }],
    strike: {
      pattern: /(^|[^\\])(~~?)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
      lookbehind: true,
      greedy: true,
      inside: {
        'punctuation': /^~~?|~~?$/
      }
    },
    hr: {
      pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
      lookbehind: !0,
      alias: "punctuation"
    },
    list: {
      pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
      lookbehind: !0,
      alias: "punctuation"
    },
    "url-reference": {
      pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
      inside: {
        variable: {
          pattern: /^(!?\[)[^\]]+/,
          lookbehind: !0
        },
        string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
        punctuation: /^[\[\]!:]|[<>]/
      },
      alias: "url"
    },
    bold: {
      pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
      lookbehind: !0,
      inside: {
        punctuation: /^\*\*|^__|\*\*$|__$/
      }
    },
    italic: {
      pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
      lookbehind: !0,
      inside: {
        punctuation: /^[*_]|[*_]$/
      }
    },
    url: {
      pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
      inside: {
        variable: {
          pattern: /(!?\[)[^\]]+(?=\]$)/,
          lookbehind: !0
        },
        string: {
          pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
        }
      }
    },
    mention: {
      pattern: /(\[@-(\d+)])/,
      lookbehind: !0,
      inside: {
        variable: {
          pattern: /(\d+)/,
          lookbehind: !0
        },
        string: {
          pattern: /(\[@-(\d+)])/
        }
      },
      alias: 'punctuation'
    }
}), Prism.languages.markdown.bold.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.italic.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.bold.inside.italic = Prism.util.clone(Prism.languages.markdown.italic), Prism.languages.markdown.italic.inside.bold = Prism.util.clone(Prism.languages.markdown.bold); // prettier-ignore

const Leaf = ({ attributes, children, leaf }) => {
  console.log(leaf)
  return (
    <span
      {...attributes}
      className={joinClasses(
        'editor-element',
        leaf.bold && 'editor-element-bold',
        leaf.italic && 'editor-element-italic',
        leaf.title && 'editor-element-title',
        leaf.strike && 'editor-element-strike',
        leaf.underlined && 'editor-element-underlined',
        leaf.list && 'editor-element-list',
        leaf.hr && 'editor-element-hr',
        leaf.blockquote && 'editor-element-blockquote',
        leaf.code && 'editor-element-code',
        leaf.url && 'editor-element-url'
      )}
    >
      {children}
    </span>
  )
}

// Define a serializing function that takes a value and returns a string.
const serialize = value => {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map(n => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join('\n')
  )
}

// Define a deserializing function that takes a string and returns a value.
const deserialize = string => {
  // Return a value array of children derived by splitting the string.
  return string.split('\n').map(line => {
    return {
      children: [{ text: line }],
    }
  })
}

const Editor = (props) => {
  let { parseMarkdown = true, doDecorate, children: content, onClick, className, readOnly, renderOnPropsUpdate,
    onInput, onBlur, onFocus, onMouseEnter, onMouseLeave, style, placeholder, onChange: onChangeFunction } = props;
    const [value, setValue] = useState(deserialize(content))
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const decorate = useCallback(([node, path]) => {
      const ranges = []
  
      if (!Text.isText(node)) {
        return ranges
      }
  
      const getLength = token => {
        if (typeof token === 'string') {
          return token.length
        } else if (typeof token.content === 'string') {
          return token.content.length
        } else {
          return token.content.reduce((l, t) => l + getLength(t), 0)
        }
      }
  
      const tokens = Prism.tokenize(node.text, Prism.languages.markdown)
      let start = 0
  
      for (const token of tokens) {
        const length = getLength(token)
        const end = start + length
  
        if (typeof token !== 'string') {
          ranges.push({
            [token.type]: true,
            anchor: { path, offset: start },
            focus: { path, offset: end },
          })
        }
  
        start = end
      }
  
      return ranges
    }, [])

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={v => setValue(v)}
    >
      <Editable 
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseUp={onClick}
        onBlur={() => onBlur && typeof onBlur === 'function' && onBlur(serialize(value))}
        onFocus={() => {
          if (onFocus && typeof onFocus === 'function') onFocus(serialize(value))
        }}

        className={joinClasses('editor', className, readOnly ? 'editor-read-only' : '')}
        decorate={parseMarkdown ? decorate : void 0}
        placeholder={placeholder}
        spellCheck={false}
        renderLeaf={parseMarkdown ? renderLeaf : void 0}
        readOnly={readOnly} />
      {/*target && users.length > 0 && (
        <Portal>
          <div ref={ref} className='popout'>
            {users.map((user, i) => (
              <Flex className='popout-list-option' key={i} direction='row' align='center'>
                <div className='popout-list-option-name'>{user.username}</div>
              </Flex>
            ))}
          </div>
        </Portal>
            )*/}
    </Slate>
  )
}

export default connect(mapStateToProps, null)(Editor);
