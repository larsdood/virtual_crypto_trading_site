import React, { Component } from 'react';
import { Label, Grid, Modal, Input, Header, Image, Dropdown, Button } from 'semantic-ui-react';
import { formatCrypto, formatUSD, requireNumberValuesGreaterThanZero } from '../Util';

import Icons from '../media/cryptocurrency-icons/index';

const defaultState = {
  fromType: 'USD',
}

class TradeModal extends Component {
  constructor(props){
    super(props);
    this.state = defaultState;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.show && nextProps.show) {
      this.setState(defaultState);
    }
  }

  setTradeAmount = (amount, props = this.props) => {
    let dollarAmount, tokenAmount;
    if (this.state.fromType === 'USD') {
        dollarAmount = parseFloat(amount) || 0;
        tokenAmount = amount / props.exchangeRates[props.tokenName].USD;
    } else {
        dollarAmount = amount * props.exchangeRates[props.tokenName].USD
        tokenAmount = parseFloat(amount)
    }

    this.setState({
      dollarAmount,
      tokenAmount,
    })
  }

  setFromType = fromType => {
    this.setState({
      fromType,
    });
  }

  renderErrorLabel(purchaseAmount, holdingAmount, maximumAmount) {
    let errorMsg;
    switch(true) {
      case purchaseAmount > holdingAmount:
        errorMsg = 'Insufficient funds';
        break;
      case purchaseAmount > maximumAmount:
        errorMsg = 'Maximum $10000 for a single buy order';
        break;
      case purchaseAmount < 0 :
        errorMsg = 'Negative amount';
      default:
        break;
    }

    if (errorMsg) return <Label content={errorMsg} color='red' pointing='left' />
    return null;
  }

  render() {
    const { show, tokenName, tradeType, onClose, holdings, buyTokens, sellTokens } = this.props;
    const cryptoHoldings = holdings.crypto;
    const currencyHoldings = holdings.currency;
    const { tokenAmount, dollarAmount } = this.state;
    if (!show) return null;
    return (
      <Modal
        open={show}
        closeIcon
        onClose={onClose}>
        <Header>
        {tokenName && <Image width='8%' height='8%' src={Icons[`${tokenName}_128`]} />} {tradeType.toUpperCase()} {tokenName} 
        </Header>
        <Modal.Content>
        {tokenName && this.props.exchangeRates && <Header>1 {tokenName} - ${this.props.exchangeRates[tokenName].USD}</Header>}
            <Input 
              labelPosition='left'
              error={this.state.dollarAmount < 0 || this.state.dollarAmount > 10000 || dollarAmount > currencyHoldings.USD}
              placeholder={defaultState.amount} 
              onChange={(_, { value }) => this.setTradeAmount(value)} >
            <Label>
              <Dropdown
                defaultValue='USD'
                options={[{ key: 'USD', text: 'USD', value: 'USD' }, { key: tokenName, text: tokenName, value: tokenName }]}
                onChange={(_, { value }) => this.setFromType(value)} />
            </Label>
            <input />
            {this.renderErrorLabel(dollarAmount, currencyHoldings.USD, 10000)}
            </Input>
            <br />
            <br />
            <Grid columns={2}>
              <Grid.Column>
                { this.props.isLoggedIn &&
                <span>
                  Balance: {(formatUSD(currencyHoldings.USD) || 0)} <br />
                  You currently hold {formatCrypto(cryptoHoldings[tokenName] || 0)} {tokenName}
                </span>}
              </Grid.Column>
              <Grid.Column>
                <Header size='medium' textAlign='right'>
                {requireNumberValuesGreaterThanZero(tokenAmount, dollarAmount) && `${tradeType === 'buy' ? 'Buying' : 'Selling'} ${formatCrypto(this.state.tokenAmount)} ${this.props.tokenName} for ${formatUSD(this.state.dollarAmount)}`}
                </Header>
              </Grid.Column>
            </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button
            color={tradeType === 'buy' ? 'green' : 'red'}
            onClick={() => {tradeType === 'buy' 
              ? buyTokens(this.props.tokenName, this.state.dollarAmount)
              : sellTokens(this.props.tokenName, this.state.tokenAmount)
              onClose()}}
            disabled={
              tradeType === 'buy'
              ? this.state.dollarAmount <= 0 || this.state.dollarAmount > 10000 || this.state.dollarAmount > currencyHoldings.USD
              : this.state.amount <= 0 || this.state.amount > cryptoHoldings[tokenName]} >
            {tradeType === 'buy' ? 'Buy' : 'Sell'}
          </Button>
          {tradeType === 'sell' &&
            <Button 
            color='purple'
            onClick={() => { sellTokens(this.props.tokenName, cryptoHoldings[tokenName]); onClose();}}>
              Sell all
            </Button>}
        </Modal.Actions>
      </Modal>
    );
  }
}

export default TradeModal;