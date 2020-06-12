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
const withMentions = editor => {
  const { isInline, isVoid } = editor
  editor.isInline = element => element.type === 'mention' ? true : isInline(element)
  editor.isVoid = element => element.type === 'mention' ? true : isVoid(element)
  return editor
}

const insertMention = (editor, user) => {
  const mention = { type: 'mention', user, children: [{ text: '' }] }
  Transforms.insertNodes(editor, mention)
  Transforms.move(editor)
}

const deserialize = string => {
  return string.split('\n').map(line => {
    return {
      children: [{ text: line }],
    }
  })
}

const Leaf = ({ attributes, children, leaf }) => {
  return (
    <span
      {...attributes}
      className={joinClasses(
        'editor-element',
        leaf.bold && 'editor-element-bold',
        leaf.italic && 'editor-element-italic',
        leaf.title && 'editor-element-title',
        leaf.underlined && 'editor-element-underlined',
        leaf.list && 'editor-element-list',
        leaf.hr && 'editor-element-hr',
        leaf.blockquote && 'editor-element-blockquote',
        leaf.code && 'editor-element-code',
      )}
    >
      {children}
    </span>
  )
}

const Element = props => {
  const { attributes, children, element } = props
  console.log(children)
  switch (element.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>
    case 'italic':
      return <i {...attributes}>{children}</i>
    case 'mention':
      return <Mention {...attributes}>{element.user ? element.user.username : 'invalid-user'}</Mention>
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'title':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <span {...attributes}>{children}</span>
  }
}

const Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body)
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

const Editor = (props) => {
  let { parseMarkdown, doDecorate, children: content, onClick, className, readOnly, renderOnPropsUpdate,
    onInput, onBlur, onFocus, onMouseEnter, onMouseLeave, style, placeholder, onChange: onChangeFunction } = props;
  // This function parses a string into an array of Node objects
  // which is what SlateJS uses to render text

  // Define a deserializing function that takes a string and returns a value.
  /*const deserialize = string => {
    // Return a value array of children derived by splitting the string.
    return string.split('\n').map(line => {
      return {
        children: [{ text: line }],
      }
    })
  }*/

  const deserialize = (text) => {
    let parseChildNodes = tokenList => {
      if (typeof tokenList === 'string') return [{ text: tokenList }];
      let children = [];
      for (let token of tokenList) {
        console.log(`%cParsing ${typeof token === 'string' ? 'text' : token.type}`, 'color: pink;font-size:14px;', token)
        if (typeof token === 'string') {
          children.push({ text: token });
        } else {
          children.push({
            type: token.type,
            children: parseChildNodes(token.content)
          });
        }
      }
      return children;
    };
    
    return {
      children: parseChildNodes(Prism.tokenize(text, Prism.languages.markdown))
    };
  }

  const ref = useRef(null);
  const returnNodes = (val) => val.split('\n').map(n => deserialize(n)).filter(Boolean) || '';
  const [value, setValue] = useState(returnNodes(content))

  const [target, setTarget] = useState()
  const [index, setIndex] = useState(0)
  const [search, setSearch] = useState('')

  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const renderElement = useCallback(props => <Element {...props} />, [])
  const editor = useMemo(() => withMentions(withReact(withHistory(createEditor()))), [])

  // This is the decorator function - it takes nodes which
  // get given a set of anchor points to apply the styling to
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

  const users = Object.values(props.users).filter(c =>
    c.username.toLowerCase().startsWith(search.toLowerCase())
  ).slice(0, 10);

  const onKeyDown = useCallback(
    event => {
      if (onInput && typeof onInput === 'function') onInput(event, serialize(value));
      if (target) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault()
            const prevIndex = index >= users.length - 1 ? 0 : index + 1
            setIndex(prevIndex)
            break
          case 'ArrowUp':
            event.preventDefault()
            const nextIndex = index <= 0 ? users.length - 1 : index - 1
            setIndex(nextIndex)
            break
          case 'Tab':
          case 'Enter':
            event.preventDefault()
            Transforms.select(editor, target)
            insertMention(editor, users[index])
            setTarget(null)
            break
          case 'Escape':
            event.preventDefault()
            setTarget(null)
            break
        }
      }
    },
    [index, search, target]
  )

  useEffect(() => {
    console.log('%cContent changed', 'color: pink;font-size:14px;')
    if (readOnly) {
      console.log('%cRe-render', 'color: red;font-size:32px;')
      setValue(returnNodes(content));
    }
  }, [content])

  // Mention list appearing above current char
  useEffect(() => {
    if (target && users.length > 0) {
      const el = ref.current;
      if (el) {
        const domRange = ReactEditor.toDOMRange(editor, target)
        const rect = domRange.getBoundingClientRect()
        el.style.top = `${rect.top + window.pageYOffset + 24}px`
        el.style.left = `${rect.left + window.pageXOffset}px`
      }
    }
  }, [users.length, editor, index, search, target])

  const onValueChanged = (newValue) => {
    const serialized = serialize(newValue);
    setValue(newValue);
    if (onChangeFunction && typeof onChangeFunction === 'function') {
      onChangeFunction(serialized);
    }

    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection)
      const wordBefore = SlateEditor.before(editor, start, { unit: 'word' })
      const before = wordBefore && SlateEditor.before(editor, wordBefore)
      const beforeRange = before && SlateEditor.range(editor, before, start)
      const beforeText = beforeRange && SlateEditor.string(editor, beforeRange)
      const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)
      const after = SlateEditor.after(editor, start)
      const afterRange = SlateEditor.range(editor, start, after)
      const afterText = SlateEditor.string(editor, afterRange)
      const afterMatch = afterText.match(/^(\s|$)/)

      if (beforeMatch && afterMatch) {
        setTarget(beforeRange)
        setSearch(beforeMatch[1])
        setIndex(0)
        return
      }
    }

    setTarget(null)
  }

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={v => onValueChanged(v)}
    >
      <Editable 
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseUp={onClick}
        onBlur={() => onBlur && typeof onBlur === 'function' && onBlur(serialize(value))}
        onFocus={() => {
          if (onFocus && typeof onFocus === 'function') onFocus(serialize(value))
        }}
        onKeyDown={onKeyDown}
        role='textbox'

        className={joinClasses('editor', className, readOnly ? 'editor-read-only' : '')}
        decorate={parseMarkdown ? decorate : void 0}
        placeholder={placeholder}
        spellCheck={false}
        renderElement={renderElement}
        renderLeaf={parseMarkdown ? renderLeaf : void 0}
        readOnly={readOnly} />
      {target && users.length > 0 && (
        <Portal>
          <div ref={ref} className='popout'>
            {users.map((user, i) => (
              <Flex className='popout-list-option' key={i} direction='row' align='center'>
                <div className='popout-list-option-name'>{user.username}</div>
              </Flex>
            ))}
          </div>
        </Portal>
      )}
    </Slate>
  )
}

export default connect(mapStateToProps, null)(Editor);
