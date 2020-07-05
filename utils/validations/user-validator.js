const jwt = require('jsonwebtoken');

/**
 * Validates token and user grants
 * @param token Request object
 * @param res Response object
 * @param grant Entity
 * @returns promise
 */
exports.validateUser = (token, res, grant) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET_KEY, function (err, authData) {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    res.json({
                        message: 'Access token expired',
                        expireDate: err.expiredAt
                    });
                    reject(false);
                } else {
                    res.json(err);
                    reject(false);
                }
            } else {
                if (validateUserType(token, grant)) {
                    resolve(true);
                } else {
                    res.json(messages.user.error.loginError);
                    reject(false);
                }
            }
        });
    });
};
/**
 * Validates if user's type is equal to user's
 * typestoraged in access token
 * @param {*} token
 * @param {*} userTypes
 */
function validateUserType(token, userTypes) {
    return new Promise(function (resolve, reject) {
        const decoded = jwt.decode(token, {complete: true});
        let result = false;
        const userType = decoded.payload.type;

        userTypes.forEach(type => {
            if (type === userType) {
                result = true;
            }
        });
        resolve(result);
    });
}