import React, { Component } from 'react';

class SearchBar extends Component {
    render () {
        return <form className="col s12 top-bar-searchbar-container">
          <div className="row">
            <div className="input-field col s6 top-bar-searchbar">
              <i className="material-icons prefix">search</i>
              <input id="icon_prefix2" className="top-bar-searchbar-input"></input>
            </div>
          </div>
        </form>
    }
}

export default SearchBar;