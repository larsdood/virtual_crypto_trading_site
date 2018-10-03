import * as T from './actionTypes';
import { createAsyncActions } from './asyncActionCreator';

export const fetchExchangeRates = {
  request: () => ({ type: T.FETCH_EXCHANGE_RATES.REQUEST }),
  success: (response) => ({ type: T.FETCH_EXCHANGE_RATES.SUCCESS, response }),
  failure: (error) => ({ type: T.FETCH_EXCHANGE_RATES.FAILURE, error }),
}

export const logIn = {
  request: (username, password, postAction) => ({ type: T.LOG_IN.REQUEST, username, password, postAction }),
  success: response => ({ type: T.LOG_IN.SUCCESS, response }),
  failure: error => ({ type: T.LOG_IN.FAILURE, error }),
}

export const buyTokens = createAsyncActions(T.BUY_TOKENS, { request: (tokenName, amount) => ({ type: T.BUY_TOKENS.REQUEST, tokenName, amount })});

export const logOut = createAsyncActions(T.LOG_OUT);

export const register = createAsyncActions(T.REGISTER, { request: (username, password) => ({ type: T.REGISTER.REQUEST, username, password })});

export const sellTokens = createAsyncActions(T.SELL_TOKENS, { request: (tokenName, amount) => ({ type: T.SELL_TOKENS.REQUEST, tokenName, amount })});

export const getUserData = createAsyncActions(T.GET_USER_DATA,
  { request: accessToken => ({ type: T.GET_USER_DATA.REQUEST, accessToken }),
    success: (response, accessToken) => ({ type: T.GET_USER_DATA.SUCCESS, response, accessToken })});
