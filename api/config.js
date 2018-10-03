module.exports = { 
  cryptoPriceUrl: 'https://min-api.cryptocompare.com/data/price',
  cryptoMultiPriceUrl: 'https://min-api.cryptocompare.com/data/pricemulti',
  enabledCryptoCoins: [ 'BTC', 'ETH', 'XRP', 'EOS', 'ETC', 'ZEC', 'BTS', 'DASH' ],
  enabledCurrencies: [ 'USD' ],
  localMongoDBAddress: 'mongodb://localhost/cryptotutorial',
  externalMongoDBAddress: 'ds247101.mlab.com:47101/crypto-virtual-trading-db',
  port: 4000,
  jwtSecret: 'Secret Strings Are Sufficient For Prototypes But Should Be Replaced When Launching Production Applications',
}