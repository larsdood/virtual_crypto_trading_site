import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react';
import { formatUSD } from '../Util';
import { totalValueSelector } from '../state/selectors';

class PersonalDataTable extends Component {
  render() {
    const { username, holdings, totalValue } = this.props;
    return (
      <Table unstackable style={{ margin: '0 10%' }} basic='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>Available</Table.HeaderCell>
            <Table.HeaderCell>Total Value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{username}</Table.Cell>
            <Table.Cell>{formatUSD(holdings.currency.USD)}</Table.Cell>
            <Table.Cell>{formatUSD(totalValue)}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

const mapStateToProps = state => ({
  username: state.username,
  holdings: state.holdings,
  totalValue: totalValueSelector(state),
})

export default connect(mapStateToProps)(PersonalDataTable);