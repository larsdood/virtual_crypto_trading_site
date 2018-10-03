var iconFolder32 = './32/';

var fs = require('fs');

const whitelist = [
  'BTC', 'BCH', 'BTS', 'DASH', 'EOS', 'ETC', 'ETH', 'XRP', 'ZEC', 'MIOTA', 'LTC', 'ADA', 'XLM', 'TRX', 'NEO', 'XMR', 'XEM', 'XTZ', 'BNB', 'OMG', 'VEN'
]

let stringToWrite = ''

let exportString = 'export default {';

fs.readdirSync(iconFolder32).filter(file => whitelist.includes(file.split('.')[0].toUpperCase())).forEach(file => {
    const exportName = file.split('.')[0].toUpperCase();
    stringToWrite += `import ${exportName}_32 from './32/${file}';\n`;
    stringToWrite += `import ${exportName}_128 from './128/${file}';\n`;

    exportString += ` ${exportName}_32, ${exportName}_128,`
});

exportString = `${exportString.substring(0, exportString.length-1)} };\n`;

stringToWrite += exportString;

fs.writeFileSync('./index.js', stringToWrite);