import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Header } from 'semantic-ui-react';
import { PortfolioItem } from '../components/PortfolioItem';
import { fetchExchangeRates } from '../state/actions';
import { formatCrypto, formatUSD } from '../Util';

class PortfolioGroup extends Component {
  constructor(props) {
    super(props);
    props.fetchExchangeRates();
  }

  renderItems = (holdings, exchangeRates) => {
    if (!exchangeRates || !holdings) return null;
    return Object.keys(holdings.crypto).map(tokenName => (
      <PortfolioItem
        key={tokenName}
        tokenName={tokenName}
        holdingText={`${formatCrypto(holdings.crypto[tokenName])} ${tokenName}`}
        exchangeRateText={formatUSD(exchangeRates[tokenName].USD)}
        totalValueText={formatUSD(exchangeRates[tokenName].USD * holdings.crypto[tokenName])}
        />
    ))
  }
    

  render() {
    return (
      <Grid style={{ margin: '0 10%' }} divided='vertically' centered>
        <Grid.Row columns={4} verticalAlign='middle'  stretched={false}>
          <Grid.Column as={Header} size='small' content='Market' />
          <Grid.Column as={Header} size='small' content='Rate' />
          <Grid.Column as={Header} size='small' content='Invested' />
          <Grid.Column as={Header} size='small' content='Value' />
        </Grid.Row>
        {this.renderItems(this.props.holdings, this.props.exchangeRates)}
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  holdings: state.holdings,
  exchangeRates: state.exchangeRates,
})

const mapDispatchToProps = dispatch => ({
  fetchExchangeRates: () => dispatch(fetchExchangeRates.request()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioGroup);