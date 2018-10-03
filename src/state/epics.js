import {Observable} from 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';
import * as T from './actionTypes';
import * as A from './actions';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api';
const FETCH_EXCHANGE_RATE_INTERVAL = 15000;

const fetchExchangeRatesEpic = action$ =>
  action$
    .ofType(T.FETCH_EXCHANGE_RATES.REQUEST)
    .switchMap(() => Observable.timer(0, FETCH_EXCHANGE_RATE_INTERVAL)
      .flatMap(() => ajax.getJSON(`${API_URL}/exchange-rates`)
        .map(response => A.fetchExchangeRates.success(response))
        .catch(error => [A.fetchExchangeRates.failure(error)])))
        .takeUntil(action$.ofType(T.FETCH_EXCHANGE_RATES.ABORT))

const loginEpic = action$ =>
  action$
    .ofType(T.LOG_IN.REQUEST)
    .switchMap(action => ajax.post(`${API_URL}/authenticate`, {username: action.username, password: action.password})
      .do(response => { if (window.localStorage) {
        window.localStorage.setItem('access_token', response.response.token)
      }})
      .map(response => A.logIn.success(response.response))
      .catch(error => [A.logIn.failure(error)]))

const buyTokens = (action$, store) =>
  action$
    .ofType(T.BUY_TOKENS.REQUEST)
    .flatMap(action => ajax({method: 'POST', url: `${API_URL}/newbuy`, body: { tokenName: action.tokenName, currency: 'USD', amount: action.amount },
    headers: { Authorization: `Bearer ${store.getState().accessToken}` }})
      .map(response => A.buyTokens.success(response.response))
      .catch(error => [A.buyTokens.failure(error)]))

const logoutEpic = (action$, store) =>
  action$
    .ofType(T.LOG_OUT.REQUEST)
    .switchMap(() => ajax.delete(`${API_URL}/logout`, { Authorization: `Bearer ${store.getState().accessToken}`})
      .map(response => A.logOut.success(response))
      .catch(error => [A.logOut.failure(error)]))

const registerEpic = (action$) =>
  action$
    .ofType(T.REGISTER.REQUEST)
    .switchMap(({ username, password }) => ajax.post(`${API_URL}/users/register`, { username, password })
      .map(response => A.register.success(response.response))
      .catch(error => [A.register.failure(error)]));

const sellTokensEpic = (action$, store) =>
  action$
    .ofType(T.SELL_TOKENS.REQUEST)
    .flatMap(action => ajax({method: 'POST', url: `${API_URL}/newsell`, body: { tokenName: action.tokenName, currency: 'USD', amount: action.amount },
    headers: { Authorization: `Bearer ${store.getState().accessToken}` }})
      .map(response => A.sellTokens.success(response.response))
      .catch(error => [A.sellTokens.failure(error)]))      

const getUserDataEpic = (action$, store) =>
  action$
    .ofType(T.GET_USER_DATA.REQUEST)
    .flatMap(action => ajax.getJSON(`${API_URL}/user/data`, { Authorization: `Bearer ${action.accessToken}`})
      .map(response => A.getUserData.success(response, action.accessToken))
      .catch(error => [A.getUserData.failure(error), A.logOut.request()]))

export default [fetchExchangeRatesEpic, loginEpic, buyTokens, logoutEpic, registerEpic, sellTokensEpic, getUserDataEpic];
