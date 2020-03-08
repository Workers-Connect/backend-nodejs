const jwt = require('jsonwebtoken');

/**
 * Verify Token
 */
let verifyToken = (req, res, next) =>{
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED_AUTH, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
};

/**
 * Verify Token in URL
 */
let verifyTokenUrl = (req, res, next) =>{
    let token = req.query.token;
    jwt.verify(token, process.env.SEED_AUTH, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
};

/**
 * Verify Admin Role
 */
let verifyRole = (req, res, next) =>{
    let usuario = req.user;
    if(usuario.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            err: {
                message: 'You haven´t permission'
            }
        });
    }

    next();
};

module.exports = {
    verifyToken,
    verifyRole,
    verifyTokenUrl
}