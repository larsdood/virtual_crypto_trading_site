import React, { Component } from 'react';
import { Button, Card } from 'semantic-ui-react';
import { formatCrypto } from '../Util';


import Icons from '../media/cryptocurrency-icons/index';

class CryptoTokenCard extends Component {

  render() {
    return (
      <Card>
        <Card.Content textAlign='center'>
          <Card.Header>
            <img width='25%' height='25%' src={Icons[`${this.props.tokenName}_128`]}>loading image failed</img>
          </Card.Header>
          <Card.Meta>{this.props.tokenName}</Card.Meta>
          <Card.Description>
            <strong>${this.props.exchangeRate}</strong>
            {this.props.holding > 0 && <div>Holding: <strong>{formatCrypto(this.props.holding)} {this.props.tokenName}</strong></div>}
          </Card.Description>
        </Card.Content>
        <Card.Content extra textAlign='center' >
        {this.props.isLoggedIn
          ?  <div className='ui two buttons'>
              <Button color='green' onClick={() => this.props.onBuyClick('buy', this.props.tokenName)}>
                BUY
              </Button>
              {this.props.holding > 0 && <Button color='red'onClick={() => this.props.onSellClick('sell', this.props.tokenName)}>
                SELL
            </Button>}
            </div>
        : 'Log in to trade'
      }
      </Card.Content>
      </Card>
    )
  }
}

export default CryptoTokenCard;
