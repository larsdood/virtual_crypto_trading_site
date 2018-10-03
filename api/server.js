const express = require('express');
const rp = require('request-promise');
const NodeCache = require('node-cache');
const bodyParser = require('body-parser');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const config = require('./config');

// initialization
const app = express();
mongoose.connect(process.env.NODE_ENV === 'production' ?
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${config.externalMongoDBAddress}` : config.localMongoDBAddress);

const User = require('./models/user');
const Blacklist = require('./models/jwtblacklist');

const tokenCache = new NodeCache({ stdTTL: 30 });
const jwtBlacklistCache = new NodeCache();

// restore blacklist cache from database
Blacklist.findOne({}, (err, blacklist) => {
  if (err) throw err;
  if (blacklist) {
    blacklist.tokens.forEach(({token, exp}) => {
        if(err) throw err;
        const secondsUntilExpire = exp - new Date().getTime() / 1000;
        if (secondsUntilExpire > 0) {
          jwtBlacklistCache.set(token, exp, secondsUntilExpire)
        }
    })
    blacklist.tokens = jwtBlacklistCache.keys().map(key => ({ token: key, exp: jwtBlacklistCache.get(key)}));
    blacklist.save();
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: true,
  credentials: true,
}));

const getAllExchangeRatesMiddleware = async (req, res, next) => {
  let exchangeRates = tokenCache.get('all');
  if (exchangeRates === undefined) {
    exchangeRates = JSON.parse(
      await rp.get(`${config.cryptoMultiPriceUrl}?fsyms=${config.enabledCryptoCoins.join(',')}&tsyms=${config.enabledCurrencies.join(',')}`)
      .catch(err => { throw(err) }));
    tokenCache.set('all', exchangeRates);  
  }
  req.data = { value: exchangeRates };
  next();
}

const requireAuthenticationMiddleware = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (!token) {
    return res.status(400).json({ message: 'missing token'})
  }
  if (!typeof token === 'string') {
    return res.status(400).json({ message: 'invalid token'});
  }
  if (token.includes('Bearer ')) {
    token = token.split(' ')[1];
  }

  if (jwtBlacklistCache.get(token)) {
    return res.status(403).json({ message: 'token has been invalidated' });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'invalid token'});
    
    req.token = token;
    req.decoded = decoded;
    
    next();
  })
}

const requireTradeDataMiddleware = (req, res, next) => {
  const { tokenName, amount, currency } = req.body;
  if (!tokenName) return res.status(400).send( { success: false, message: 'no coin to trade specified' });
  if (typeof tokenName !== 'string') return res.status(400).send({ success: false, message: `expected tokenName to be of type string, was ${typeof tokenName}`});
  if (!config.enabledCryptoCoins.includes(tokenName)) return res.status(400).send({ success: false, message: `token ${tokenName} not supported`})
  
  if (!currency || !config.enabledCurrencies.includes(currency)) return res.status(400).send( { success: false, message: 'no currency with which to trade specified' });
  if (typeof currency !== 'string') return res.status(400).send( { success: false, message: `expected currency to be of type string, was ${typeof currency}`})
  if (!config.enabledCurrencies.includes(currency)) return res.status(400).send( { success: false, message: `currency ${currency} is not supported` })
  
  if (!amount) return res.status(400).send( { success: false, message: 'no amount to trade specified' });
  if (!(typeof amount === 'string' && /^\d+(.\d+)?/.test(amount))) return res.status(400).send( { success: false, message: `expected amount to be of type number, was ${typeof amount}` });
  if (!config.enabledCryptoCoins.includes(tokenName)) return res.status(400).send({ success: false, message: 'token not available for trading' });
  next();
}

app.get('/api/exchange-rates', getAllExchangeRatesMiddleware, (req, res) => {
  return res.json(req.data.value);
})

app.post('/api/users/register', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, existingUser) => {
    if (err) throw err;
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'user already exists' });
    } else {
      const newUser = new User({
        username,
        password,
      })
      User.createUser(newUser, (err, user) => {
        if (err) throw err;
        return res.status(200).send({success: true, message: `new user ${user.username} registered`})
      })
    }
  })
});

app.get('/api/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) throw err;
    res.json(users);
  })
})

app.post('/api/authenticate', (req, res) => {
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.status(401).json({ success: false, message: "Authentication failed: user not found"});
    } 

    User.comparePassword(req.body.password, user.password, (err, isMatch) => {
      if (err) throw err;
      if(!isMatch) {
        return res.status(401).json({ success: false, message: "Authentication failed: wrong password"});
      }
    });

    const payload = {
      holdings: user.holdings,
      username: user.username,
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '10h' });

    return res.json({ success: true, message: "successfully logged in", token, holdings: user.holdings, username: user.username });
  })
})

app.post('/api/newsell', requireAuthenticationMiddleware, getAllExchangeRatesMiddleware, requireTradeDataMiddleware, (req, res) => {
  const { tokenName, amount, currency } = req.body;
  User.findOne({
    username: req.decoded.username,
  }, (err, user) => {
    if (err) throw err;
    const { holdings } = user;
    if (holdings.crypto[tokenName] === undefined || holdings.crypto[tokenName] < amount) {
      return res.status(400).send({ success: false, message: `insufficient amount of ${tokenName}`})
    }

    const exchangeRate = req.data.value[tokenName.toUpperCase()][currency.toUpperCase()];

    const currencyAmount = amount * exchangeRate;

    holdings.currency[currency] += currencyAmount;
    holdings.crypto[tokenName] -= amount;

    user.holdings = holdings;

    if (holdings.crypto[tokenName] === 0) {
      delete holdings.crypto[tokenName];
    }
    user.save((err, updatedUser) => {
      if (err) throw err;
      return res.send({success: true, message: `succesfully sold ${amount} ${tokenName}`, holdings: updatedUser.holdings});
    })
  })
})

app.post('/api/newbuy', requireAuthenticationMiddleware, getAllExchangeRatesMiddleware, requireTradeDataMiddleware, (req, res) => {
  const { tokenName, amount, currency } = req.body;
  User.findOne({
    username: req.decoded.username,
  }, (err, user) => {
    if (err) throw err;
    const { holdings } = user;
    if (holdings.currency[currency] === undefined || holdings.currency[currency] < amount) {
      return res.status(400).send({ success: false, message: "insufficient funds" });
    }
  
    const exchangeRate = req.data.value[tokenName][currency];
  
    const purchaseAmount = amount / exchangeRate;

    holdings.currency[currency] -= amount;
    if (typeof holdings.crypto[tokenName] === 'number') {
      holdings.crypto[tokenName] += purchaseAmount;
    } else {
      holdings.crypto[tokenName] = purchaseAmount;
    }

    user.holdings = holdings;
    user.save((err, updatedUser) => {
      if (err) throw err;
      return res.send({ success: true, message: `succesfully purchased ${purchaseAmount} ${tokenName}`, holdings: updatedUser.holdings });
    })
  })
})

app.get('/api/user/data', requireAuthenticationMiddleware, (req, res) => {
  User.findOne({
    username: req.decoded.username,
  }, (err, { holdings, username }) => {
    if (err) throw err;
    return res.status(200).json({ holdings, username });
  })
})

app.delete('/api/logout', requireAuthenticationMiddleware, (req, res) => {
  jwtBlacklistCache.set(req.token, req.decoded.exp, req.decoded.exp - new Date().getTime()/1000, (err, success) => {
    if (err) throw err;
    Blacklist.findOne({}, (err, blacklist) => {
      if (err) throw err;
      if (!blacklist) {
        blacklist = new Blacklist({ tokens: []})
      }
      blacklist.tokens = jwtBlacklistCache.keys().map(key => ({ token: key, exp: jwtBlacklistCache.get(key)}));
      blacklist.save();
    })
  });
  res.status(200).json({ success: true, message: 'logged out' });
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../build'));
}


const PORT = process.env.PORT || config.port;

app.listen(PORT, () => console.log(`listening to port ${PORT}`));
