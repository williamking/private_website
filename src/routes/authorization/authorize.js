'use strict';

module.exports = {
    requireAdministrator: (req, res, next) => {
    	if (req.session.user && req.session.role) {
    		next();
    	} else {
    		res.json({ status: 'NOT_AUTHORIZED', msg: '抱歉，非权限狗不得入内！' });
    	}
    },

    requireLogin: (req, res, next) => {
    	if (req.session.user) next();
    	else res.json({ status: 'NOT_LOGIN', msg: '请先登录喔，亲！' });
    }
};