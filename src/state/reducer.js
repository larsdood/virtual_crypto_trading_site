import * as T from './actionTypes'

const accessToken = window.localStorage ? window.localStorage.getItem('access_token') : null;

const defaultState= {
  accessToken: accessToken,
  requestInProgress: [],
  holdings: {
    crypto: {},
    currency: {},
  }
}

const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case T.FETCH_EXCHANGE_RATES.REQUEST:
      return { ...state, requestInProgress: state.requestInProgress.concat([T.FETCH_EXCHANGE_RATES.ROOT]) }
    case T.FETCH_EXCHANGE_RATES.SUCCESS:
      return { ...state, exchangeRates: { ...action.response }, requestInProgress: state.requestInProgress.splice(T.FETCH_EXCHANGE_RATES.ROOT)}
    case T.FETCH_EXCHANGE_RATES.FAILURE:
      return { ...state }
    case T.LOG_IN.SUCCESS:
    case T.GET_USER_DATA.SUCCESS:
      return { ...state, holdings: action.response.holdings, accessToken: action.response.token || action.accessToken, username: action.response.username}
    case T.LOG_OUT.SUCCESS:
    case T.LOG_OUT.FAILURE:
      if (window.localStorage) {
        window.localStorage.removeItem('access_token');
      }
      return { ...state, accessToken: null, holdings: defaultState.holdings, };
    case T.BUY_TOKENS.SUCCESS:
      return { ...state, holdings: action.response.holdings}
    case T.SELL_TOKENS.SUCCESS:
      return { ...state, holdings: action.response.holdings}
    default: 
      return state;
  }
}

export default reducer;