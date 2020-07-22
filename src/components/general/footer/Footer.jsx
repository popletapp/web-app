import React from 'react';
import { Flex, FlexChild, Tooltip } from './../../';
import { Link } from 'react-router-dom';
import app from './../../../../package.json';

function Footer () {
    return (
        <footer>
            <Flex align='center' direction='row'>
            <FlexChild align='left'>
                Poplet v.{app.version} beta
            </FlexChild>

            <FlexChild className='landing-links' align='right' justify='end'>
                <Link to='/'>Landing</Link>
                <Link to='/blog'>Blog</Link>
                <Link to='/feedback'>Feedback</Link>
                <Tooltip content="Doesn't exist yet!"><Link to='/404'>Privacy Policy</Link></Tooltip>
                <Link to='/help'>Help</Link>
            </FlexChild>
            </Flex>
        </footer>
    )
}

export default Footer;