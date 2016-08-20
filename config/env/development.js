const fs = require('fs');
const path = require('path');

module.exports = {
	administrator: '$2a$05$4VIAk/kXnT2sTv5.1LWkuOySXY0vXnHIzzNLDG6CVkprmmBJPAjKu',
	saltNum: 10,
	port: 8000,
	database: 'mongodb://william:17881243@ds015915.mlab.com:15915/website-of-william',
	spdy_options: {
      key: fs.readFileSync(path.join(__dirname, '../../cert/development/prvtkey.pem')),
      cert: fs.readFileSync(path.join(__dirname, '../../cert/development/cacert.pem')),
      spdy: {
        protocols: ['h2', 'spdy/3.1', 'spdy/3', 'spdy/2', 'http/1.1', 'http/1.0'],
        plain: false,
        'x-forwarded-for': true,
        connection: {
          'window-size': 1024 * 1024,
          'auto-spdy31': false
        }
      }
	}
}