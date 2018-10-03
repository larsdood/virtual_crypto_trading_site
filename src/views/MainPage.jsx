import React, { Component } from 'react';
import TokenCardGroup from '../containers/TokenCardGroup';
import { Header, Icon, Responsive } from 'semantic-ui-react';

class MainPage extends Component {
  render() {
    return (
      <div className="App">
        <Header style={{ marginTop: '20px', marginBottom: '20px'}} size='huge' textAlign='center'><Icon name='exchange' />Cryptotrader</Header>
        <TokenCardGroup isLoggedIn={this.props.isLoggedIn}/>
      </div>
    )
  }
}

export default MainPage;