import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar } from './../../components';
import { Link } from 'react-router-dom'
import './Home.scss';

function mapStateToProps (state) {
    return {
        boards: state.boards,
        user: state.user
    }
}

class Home extends Component {
    render () {
        const { boards, user } = this.props;
        return (
            <div className='poplet-root center-on-page home'>
                <div className='home-header'>
                    <img src='./assets/icons/poplet_white_no_bg.svg' width='32' height='32' alt=''></img>
                    <h1 className='home-header-text'>
                        Home
                    </h1>

                    <div className='user-container'>
                        <Avatar url={user.avatar} alt={user.username} size={32} />
                        <div className='user-username'>{user.username}</div>
                    </div>
                </div>

                <div className='home-content-container'>
                    <div className='board-selector'>
                        <h2>Boards</h2>
                        {Object.values(boards).map(board => {
                            return (
                                <Link className='board-item' to={`/boards/${board.id}`}>
                                    <Avatar url={board.avatar} alt={board.name} size={32} />
                                    <div className='board-item-name'>
                                        {board.name}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                    <div className='home-content'>

                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(Home);