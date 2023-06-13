const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

async function authUser(req, res, next) {
    try {
        const { access_token } = req.headers;
        if (!access_token) {
            throw { name: 'token_error', message: 'Invalid token', code: 401 }
        }

        const payload = verifyToken(access_token);

        if (!payload) {
            throw { name: 'token_error', message: 'Invalid token', code: 401 }
        }

        const checkUser = await User.findByPk(payload.id);
        if (!checkUser) {
            throw { name: 'unauthorized', message: 'Unauthorized Access', code: 403 }
        }

        next();
    } catch (err) {
        next(err);
    }
}

module.exports = { authUser }