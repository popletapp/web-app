import React, { Component } from 'react';
import { NavBar, Button, Flex, RichTextbox, Editor } from '../../components';
import { Link } from 'react-router-dom';
import './Test.scss';

const MARKDOWN_TEST_CONTENT = `
Regular String
**Bold Text**
*Italic Text*
~~Strikethrough~~
[Link to image](https://nevulo.xyz/meme/feels)
![Displaying image](https://nevulo.xyz/meme/feels)
`

const NEWLINE_TEST_CONTENT = `Line 1\nLine 2\n\nLine 4\n\n\n\nLine 8\nLine 9\n\nLine 11\n\n\n\n\n\n\nLine 18`

class Test extends Component {
  constructor () {
    super();
    this.state = {
      markdownTestDecorate: false
    };
  }

  render () {
    const { markdownTestDecorate } = this.state;
    return (
      <div className='premium'>
        <section>
          <NavBar icon='poplet_black_no_bg' />
          <div className='inner'>
            <div className='intro-title'>
              <h1 className='main-title'>Poplet Testing Facility</h1>
            </div>
          </div>
        </section>
        
        <header>Markdown Test</header>
        <p><i className='material-icons'>info</i> Both textboxes should be identical.</p>
        <Button onClick={() => this.setState({ markdownTestDecorate: !markdownTestDecorate })}>Toggle decorations on editor</Button>
        <Flex direction='row'>
          <RichTextbox>{MARKDOWN_TEST_CONTENT}</RichTextbox>
          <Flex>
            <Editor>{MARKDOWN_TEST_CONTENT}</Editor>
          </Flex>
        </Flex>

        <header>Newline Test</header>
        <p><i className='material-icons'>info</i> All 3 textboxes should be identical.</p>
        <Flex direction='row'>
          <textarea>{NEWLINE_TEST_CONTENT}</textarea>
          <RichTextbox>{NEWLINE_TEST_CONTENT}</RichTextbox>
          <Flex>
            <Editor>{NEWLINE_TEST_CONTENT}</Editor>
          </Flex>
        </Flex>
      </div>
    );
  }
}

export default Test;
