import React, { Component } from 'react';
import { NavBar, Flex, FlexChild, RichTextbox } from '../../components';
import { getPost } from './../../modules';
import './Post.scss';
import Poplet from './../../';

class Post extends Component {
  constructor () {
    super();
    this.state = {
      post: null
    }
  }

  async componentDidMount () {
    const props = this.props;
    const store = Poplet.store;
    const state = store.getState();
    this.state = { post: null };
    let post = state.blogPosts[props.match.params.id];
    if (!post) {
      post = await getPost(props.match.params.id);
    }
    this.setState({ post });
  }

  render () {
    let { post } = this.state;
    if (!post) {
      post = {
        title: 'Post not found',
        content: `*Sorry!* You tried to access a blog post that doesn't exist.`
      }
    }
    const { title, content } = post;
    return (
      <div className='blog-body'>
        <div className='blog'>
          <section className='blog-cinematic'>
            <NavBar icon='poplet_black_no_bg' />
            <div className='inner'>
              <div className='intro-title'>
                <h1 className='blog-main-title'>{title}</h1>
              </div>
            </div>
          </section>
        </div>

        <RichTextbox className='blog-content'>
          {content}
        </RichTextbox>
      </div>
    );
  }
}

export default Post;
