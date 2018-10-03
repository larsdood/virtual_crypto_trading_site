import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import TopBar from './containers/TopBar';
import MainPage from './views/MainPage';
import Portfolio from './views/Portfolio';
import { isLoggedInSelector } from './state/selectors';
import { getUserData } from './state/actions';


class App extends Component {
  constructor(props) {
    super(props);
    if (window.localStorage) {
      const accessToken = window.localStorage.getItem('access_token');
      if (accessToken) {
        this.props.getUserData(accessToken);
      }
    }
  }
  render() {

    return (
      <Router>
        <div>
          <TopBar isLoggedIn={this.props.isLoggedIn}/>
          <Route exact path="/" component={MainPage} />
          <Route path="/portfolio" component={Portfolio} />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: isLoggedInSelector(state)
})

const mapDispatchToProps = (dispatch) => ({
  getUserData: accessToken => dispatch(getUserData.request(accessToken)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
