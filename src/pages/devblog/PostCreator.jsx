import React, { Component } from 'react';
import { PopletBase, NavBar, Flex, FlexChild, Editor, Button, ConfirmModal } from '../../components';
import { createPost, createModal } from './../../modules';
import './PostCreator.scss';
import { PermissionsHandler } from './../../util/permissions';
import { connect } from 'react-redux';

function mapStateToProps (state) {
  return {
    user: state.user
  }
}

class PostCreator extends PopletBase {
  constructor () {
    super();
    this.state = {
      preview: false,
      content: 'e',
      title: ''
    };
  }

  async componentDidMount () {
    await this.init();
  }

  async submit () {
    const { title, content } = this.state;
    const { user } = this.props;
    await createPost({
      title,
      content,
      author: user.id,
      type: 1
    }).then(() => {
      const modal = {
        title: 'Post Created',
        content: 'The post was created!'
      }
      createModal(<ConfirmModal 
        onConfirm={() => window.location.replace('/blog')} 
        title={modal.title}
        content={modal.content} 
        confirmText='Okay'
        cancelText='get out of my face'
        />)
    });
  }

  onBlur (value) {
    this.setState({ content: value })
  }

  onBlurTitle (value) {
    this.setState({ title: value })
  }

  render () {
    const { title, preview, content } = this.state;
    const { user } = this.props;
    //if (user && !PermissionsHandler.isDeveloper(user.id)) return 'there is nothing here what are you talking about';
    return (
      <div className='blog-editor'>
        <NavBar />

        <Flex className='blog-editor-body'>
          <h1>Blog Post Creator</h1>
          <Button color='red' onClick={() => this.setState({ preview: !preview })}>{preview ? 'Hide' : 'Show'} Preview</Button>
          <br />
          <Editor onBlur={(e) => this.onBlurTitle(e)}
            parseMarkdown={preview} 
            readOnly={preview} 
            className='blog-post-editor-title'>{title}</Editor>
          <br />
          <Editor onBlur={(e) => this.onBlur(e)}
            parseMarkdown={preview} 
            readOnly={preview} 
            className='blog-post-editor'>{content}</Editor>
          <br />
          <br />
          <Flex>
            <Button color='green lighten-1' onClick={async () => {
              console.log('Creating post with title ' + title)
              await this.submit()
            }}>Create</Button>
          </Flex>
        </Flex>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(PostCreator);
