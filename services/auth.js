const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');

const { SECRET_KEY } = require('../keys.js');

function HeaderAuth({ req }) {

    // console.log(req);
    // console.log(req.get('authorization'))
    const headerToken = req.get('authorization');

    if(headerToken) {
        try {
            const token = headerToken.trim();
            const user = jwt.verify(token, SECRET_KEY);
            return  user;
        }
        catch(err) {
            throw new AuthenticationError('token expired');
        }
    }
    throw new AuthenticationError('no authentication header');
}

module.exports = { HeaderAuth };