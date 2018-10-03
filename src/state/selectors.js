import { createSelector } from 'reselect';

const exchangeRatesSelector = state => state.exchangeRates;
const holdingsSelector = state => state.holdings;
const accessTokenSelector = state => state.accessToken;

export const totalValueSelector = createSelector(
  exchangeRatesSelector,
  holdingsSelector,
  (exchangeRates, holdings) =>  
    exchangeRates && holdings
      ? Object.keys(holdings.crypto || []).reduce((accumulatedValue, tokenName) => 
        accumulatedValue + exchangeRates[tokenName].USD * holdings.crypto[tokenName], holdings.currency.USD)
      : null,
  )
    

export const isLoggedInSelector = createSelector(
  accessTokenSelector,
  accessToken => !!accessToken,
)