'use strict'
const User = require('../../models/UserModel');

class UserRepository {

    async getUserByEmail(email) {
        return await User.findOne({ email: email }).select('+password');
    }

    async createUser(req) {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        return await user.save();
    }

    async userSetRememberTokenById(email, token) {
        return await User.findOneAndUpdate({ email: email },
            {
                '$set': {
                    'remember_token': token
                }
            }
        )
    }

}

module.exports = UserRepository