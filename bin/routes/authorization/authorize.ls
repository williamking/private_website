authorizor = exports

authorizor.require-login = (req, res, next)!->
    if req.session.user then next! else res.go '/login'

authorizor.has-login = (req, res, next)!->
    if not req.session.user then next! else res.go '/'
