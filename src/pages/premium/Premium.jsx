import React, { Component } from 'react';
import { NavBar, Flex, FlexChild } from '../../components';
import { Link } from 'react-router-dom';
import './Premium.scss';

function PremiumFeatureCard (props) {
  const { title, desc, id } = props;
  return (
    <Flex align='center' grow={1} shrink={0} justify='center' className={`premium-feature-card ${id ? `premium-feature-card-${id}` : ''}`}>
      <FlexChild className='premium-feature-card-image'>
        <img src='./../../assets/svg/poplet-background-dark-purple.svg' className='premium-feature-card-image-img'></img>
      </FlexChild>
      <FlexChild className='premium-feature-card-info'>
        <div className='premium-feature-card-title'>{title}</div>
        <div className='premium-feature-card-desc'>{desc}</div>
      </FlexChild>
    </Flex>
  )
}

class Premium extends Component {
  render () {
    return (
      <div className='premium'>
        <section className='premium-cinematic'>
            <NavBar icon='poplet_black_no_bg' />
            <div className='premium-inner'>
              <div className='premium-intro-title'>
                <h1 className='main-title'>Poplet Premium</h1>
                <h3 className='intro-description-title'>Take note-taking one step further with Poplet Premium</h3>
                <br />
                <Flex basis='33.33333%' shrink={0} grow={0} direction='row' align='center' className='premium-intro-details'>
                  <PremiumFeatureCard id={1} title='Custom badge on profile' />
                  <PremiumFeatureCard id={2} title='Change your username' />
                  <PremiumFeatureCard id={3} title='Upload pictures in chatrooms' />
                  <PremiumFeatureCard id={4} title='More options on notes' desc='Be more creative with your colors' />
                  <PremiumFeatureCard id={5} title='Customize your profile' desc='Add a bio, custom content and invites to boards on your profile' />
                  <PremiumFeatureCard id={6} title='More freedom' desc='Join up to 250 boards (up from 50) and create up to 100 rules (up from 15)' />
                </Flex>
              </div>

              <Flex className='premium-buy-section'>
                <h1>Get <img style={{ marginLeft: '4px' }} src='./../../assets/icons/poplet_black_no_bg.svg' width='24' height='24' alt='' /> Premium today</h1>
                <div className='btn disabled'>Coming soon</div>
              </Flex>
            </div>
          </section>
      </div>
    );
  }
}

export default Premium;
