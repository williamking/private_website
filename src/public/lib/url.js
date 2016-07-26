'use strict';

class UrlParser {
	constructor(url) {
		this.url = url;
		this.query = {};
		this.parse();
	}

	parse() {
	    let queryString = this.url.split('?')[1];
            if (!queryString) return;
            let items = queryString.split('&');
            for (let item of items) {
            	let data = item.split('='),
            	    key = data[0],
            	    value = data[1];
            	if (key && value) {
            		this.query[key] = value;
            	}
            }
	}
}

module.exports = UrlParser;