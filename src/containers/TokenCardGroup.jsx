import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchExchangeRates, buyTokens, sellTokens } from '../state/actions';
import { isLoggedInSelector } from '../state/selectors';
import CryptoTokenCard from '../components/CryptoTokenCard';
import { Card, Container } from 'semantic-ui-react';
import TradeModal from '../components/TradeModal';

const defaultState = {
  buyModal: null,
  sellModal: null,
  buyAmount: 0,
  showModal: false,
  selectedToken: null,
  tradeModal: {
    show: false,
    tokenName: null,
    tradeType: null,
  }
}

class TokenCardGroup extends Component {
  constructor(props) {
    super(props);
    this.props.fetchExchangeRates();
    this.state=  defaultState;
  }
  handleTriggerModal = (tradeType, tokenName) => {
    this.setState({ tradeModal: {
      show: true,
      tokenName: tokenName,
      tradeType
    }})
  }
  handleCloseModal = () => {
    this.setState({ tradeModal: defaultState.tradeModal });
  }
  handleBuyModalTrigger = tokenName => {
    this.setState({ showModal: true, selectedToken: tokenName });
  }
  handleSellModalTrigger = tokenName => {
    this.setState({ sellModal: tokenName });
  }
  renderCards() {
    if (!this.props.exchangeRates) {
      return null;
    }
    return Object.keys(this.props.exchangeRates).map(key => 
      <CryptoTokenCard
        onBuyClick={this.handleTriggerModal}
        onSellClick={this.handleTriggerModal}
        key={key}
        tokenName={key}
        exchangeRate={this.props.exchangeRates[key].USD}
        holding={this.props.holdings.crypto[key]}
        isLoggedIn={this.props.isLoggedIn}/>
    )
  }
  render() {
    return (
      <Container>
        <Card.Group stackable centered itemsPerRow={3}>
          {this.renderCards()}
        </Card.Group>
        <TradeModal
          show={this.state.tradeModal.show}
          tokenName={this.state.tradeModal.tokenName}
          tradeType={this.state.tradeModal.tradeType}
          onClose={this.handleCloseModal}
          exchangeRates={this.props.exchangeRates}
          holdings={this.props.holdings}
          isLoggedIn={this.props.isLoggedIn}
          buyTokens={this.props.buyTokens}
          sellTokens={this.props.sellTokens}/>
      </Container>
    )

  }
}

const mapStateToProps = state => ({
  exchangeRates: state.exchangeRates,
  holdings: state.holdings,
  isLoggedIn: isLoggedInSelector(state),
})

const mapDispatchToProps = dispatch => ({
  fetchExchangeRates: () => dispatch(fetchExchangeRates.request()),
  buyTokens: (tokenName, amount) => dispatch(buyTokens.request(tokenName, amount)),
  sellTokens: (tokenName, amount) => dispatch(sellTokens.request(tokenName, amount)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TokenCardGroup);
