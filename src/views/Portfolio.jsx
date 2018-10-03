import React, { Component } from 'react';
import PortfolioGroup from '../containers/PortfolioGroup';
import PersonalDataTable from '../containers/PersonalDataTable';

class Portfolio extends Component {
  render() {
    return (
      <div>
        <PersonalDataTable />
        <PortfolioGroup />
      </div>
    )
  }
}

export default Portfolio;