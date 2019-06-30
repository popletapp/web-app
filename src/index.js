import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Application from './App';
import CriticalFailure from './components/CriticalFailure';
import Login from './components/Login';
import Loader from './components/Loader';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';

// there should be a log in thing here but lets just say theoretically we've already done that
const BASE_URL = 'http://localhost:7777/api/v1';

axios.defaults.baseURL = BASE_URL;

global.Poplet = {
    API: {
        BASE_URL
    }
};
let Poplet = global.Poplet;

async function render () {
    await axios.get('/gateway/connect')
        .then(() => {
            ReactDOM.render(<Loader />, document.getElementById('root'));
        })
        .catch(err => {
            ReactDOM.render(<CriticalFailure />, document.getElementById('root'));
        });
    
    const getCurrentUser = () => axios.get(`/user/me`).then(res => res.data);
    const token = localStorage.getItem('token');
    if (!token) {
        return ReactDOM.render(<Login />, document.getElementById('root'));
    } else {
        axios.defaults.headers.common['Authorization'] = token;
        const user = await getCurrentUser();
        console.log(`Logged in as ${user.username} (${user.id})!`)
        Poplet.user = user;
    }

    const getUserBoards = () => axios.get(`/user/${Poplet.user.id}/boards`).then(res => res.data);
    const getBoard = (boardID) => axios.get(`/board/${boardID}`).then(res => res.data);
    
    axios.all([ getUserBoards() ])
        .then(axios.spread(async function (boards) {
            Poplet.boards = []; // Array of board objects
            // Get the current list of ID's of the boards that this user is in and create new board objects from the ID's
            // Fetch from the API to convert ID's to objects
            Poplet.boards = await Promise.all(boards.map(board => getBoard(board)))
            Poplet.boards.selected = Poplet.boards[0]; // Make a GET request to determine the last board selected, otherwise `null` (send to homepage)
            
            Poplet.users = [];
            Poplet.notes = [];
            // Same applies for users: fetch all users inside of the board that were fetched above (each board will have a `members` property with IDs)
            for (const board of Poplet.boards) {
                if (board) {
                    Poplet.users = Poplet.users.concat(board.members); // Array of cached users
                    Poplet.notes = Poplet.notes.concat(board.notes); // Some notes should be cached to prevent having to call the API each time
                }  
            }

            ReactDOM.render(<Application board={Poplet.boards.selected} />, document.getElementById('root'));
        }));
}

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export default Poplet;
export { render };