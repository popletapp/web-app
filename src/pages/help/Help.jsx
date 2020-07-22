import React, { Component } from 'react';
import { NavBar, Flex, FlexChild, Footer } from '../../components';
import { Link } from 'react-router-dom';
import './Help.scss';

function HelpArticleCard (props) {
  const { title, desc, icon } = props;
  return (
    <Flex align='center' grow={1} shrink={0} justify='center' className='help-article'>
      <FlexChild className='help-article-image'>
        {icon === 'poplet' ? (
          <img src='./../../assets/icons/poplet_white_no_bg.svg' width='54' height='54' alt='' />
        ) : (
          <i className='medium material-icons'>{icon}</i>
        )}
      </FlexChild>
      <FlexChild className='help-article-info'>
        <div className='help-article-title'>{title}</div>
        <div className='help-article-desc'>{desc}</div>
      </FlexChild>
    </Flex>
  )
}

class Help extends Component {
  render () {
    return (
      <div className='help'>
        <section className='premium-cinematic'>
            <NavBar icon='poplet_black_no_bg' />
            <div className='premium-inner'>
              <div className='help-intro'>
                <h1 className='help-title'>Poplet Help</h1>
                <input className='help-searchbar'></input>
                <br />
                <Flex basis='33.33333%' shrink={0} grow={0} direction='row' align='center' className='premium-intro-details'>
                  <HelpArticleCard id={1} title='Poplet Premium' icon='poplet' />
                  <HelpArticleCard id={2} title='Account Settings' icon='settings' />
                  <HelpArticleCard id={3} title='User Interface' icon='dashboard' />
                </Flex>
              </div>
            </div>
          </section>
          <Footer />
      </div>
    );
  }
}

export default Help;
