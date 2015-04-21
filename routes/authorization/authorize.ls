authorizor = exports

authorizor.require-login = (req, res, next)!->
    if req.is-authenticated! then next! else res.write('Go to login')

authorizor.has-login = (req, res, next)!->
    if req.is-authenticated! then res.write('Has logined')
    else next!

