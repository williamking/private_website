const fs = require('fs');
const path = require('path');

module.exports = {
	administrator: '$2a$05$4VIAk/kXnT2sTv5.1LWkuOySXY0vXnHIzzNLDG6CVkprmmBJPAjKu',
	saltNum: 10,
	port: 443,
	database: 'mongodb://localhost/website',
	spdy_options: {
      cert: fs.readFileSync(path.join(__dirname, '../../cert/production/1_zone.williamking.cn_cert.crt')),
      key: fs.readFileSync(path.join(__dirname, '../../cert/production/2_zone.williamking.cn.key')),
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
