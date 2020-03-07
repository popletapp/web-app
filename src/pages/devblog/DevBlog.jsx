import React, { Component } from 'react';
import { NavBar, Flex, FlexChild, Editor } from '../../components';
import { getLastPosts } from '../../modules';
import { Link } from 'react-router-dom';
import app from './../../../package.json';
import './DevBlog.scss';
import { withTranslation } from 'react-i18next';

class BlogPostPreview extends Component {
  render () {
    const { post } = this.props;
    const { title, content, timestamp, type, id } = post;
    return (
      <div className='blog-content-card'>
        <Link to={`/blog/post/${id}`} className='blog-content-card-title'>{title}</Link>
        <Editor parseMarkdown={true} editing={false} className='blog-content-card-content'>{`${content.slice(0, 255)}...`}</Editor>
      </div>
    )
  }
}

class DevBlog extends Component {
  constructor () {
    super();
    this.state = {
      posts: []
    };
  }

  async componentDidMount () {
    this.setState({
      posts: await getLastPosts()
    })
  }

  render () {
    const { t } = this.props;
    const { posts } = this.state;
    return (
      <div className='blog-body'>
        <div className='blog'>
          <section className='blog-cinematic'>
            <NavBar icon='poplet_black_no_bg' />
            <div className='inner'>
              <div className='intro-title'>
                <h1 className='blog-main-title'>{t("BLOG_TITLE")}</h1>
                <h3 className='blog-description-title'>{t("BLOG_DESCRIPTION")}</h3>
              </div>
            </div>
          </section>
        </div>

        <div className='blog-content'>
          {posts.map(post => <BlogPostPreview post={post} />)}
        </div>
      </div>
    );
  }
}

export default withTranslation()(DevBlog);
