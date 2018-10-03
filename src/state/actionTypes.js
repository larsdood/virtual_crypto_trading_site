import { createAsyncActionTypes} from './asyncActionCreator';

export const FETCH_EXCHANGE_RATES = {
  ROOT: 'FETCH_EXCHANGE_RATES',
  REQUEST: 'FETCH_EXCHANGE_RATES@REQUEST',
  SUCCESS: 'FETCH_EXCHANGE_RATES@SUCCESS',
  FAILURE: 'FETCH_EXCHANGE_RATES@FAILURE',
  ABORT: 'FETCH_EXCHANGE_RATES@ABORT'
};

export const LOG_IN = {
  ROOT: 'LOG_IN',
  REQUEST: 'LOG_IN@REQUEST',
  SUCCESS: 'LOG_IN@SUCCESS',
  FAILURE: 'LOG_IN@FAILURE',
}

export const BUY_TOKENS = {
  ROOT: 'BUY_TOKENS',
  REQUEST: 'BUY_TOKENS@REQUEST',
  SUCCESS: 'BUY_TOKENS@SUCCESS',
  FAILURE: 'BUY_TOKENS@FAILURE',
}

export const LOG_OUT = createAsyncActionTypes('LOG_OUT');

export const REGISTER = createAsyncActionTypes('REGISTER');

export const SELL_TOKENS = createAsyncActionTypes('SELL_TOKENS');

export const GET_USER_DATA = createAsyncActionTypes('GET_USER_DATA');
