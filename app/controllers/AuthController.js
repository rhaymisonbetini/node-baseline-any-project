'use strict'

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const mailer = require('../../config/mailer')

const UserRepository = require('../repositories/UserRepository');
const { userValidator, userLoginValidator, userEmailValidator } = require('../validators/UserValidators');
const env = require('../../config/env.json');

class AuthController {

    static async register(req, res) {
        try {

            let validator = await userValidator(req.body)

            if (validator) {
                let userRepository = new UserRepository();
                let newUser = await userRepository.createUser(req)
                return res.status(201).send({ user: newUser })
            }
        } catch (e) {
            console.log(e)
            return res.status(500).json({ error: e })
        }
    }

    static async login(req, res) {
        try {

            let validator = await userLoginValidator(req.body)

            if (validator) {
                const { email, password } = req.body;
                let userRepository = new UserRepository();
                let user = await userRepository.getUserByEmail(email);

                if (!user) {
                    return res.status(400).send({ error: 'User not found' });
                }

                if (! await bcrypt.compare(password, user.password)) {
                    return res.status(401).send({ error: 'Umauthorized' });
                }

                user.password = null;

                const token = jwt.sign({ id: user.id }, env.api_key, {
                    expiresIn: 86400
                })

                return res.status(201).send({ user, token });
            }
        } catch (e) {
            console.log(e)
            return res.status(500).json({ error: e })
        }
    }

    static async recoverPass(req, res) {
        try {

            let validator = await userEmailValidator(req.body)

            if (validator) {
                const { email } = req.body;

                let userRepository = new UserRepository();
                let user = await userRepository.getUserByEmail(email);

                if (!user) {
                    return res.status(401).send({ error: 'unathorized' })
                }

                const token = crypto.randomBytes(6).toString('hex')
                await userRepository.userSetRememberTokenById(email);

                await mailer.sendMail({
                    to: email,
                    from: env.mail,
                    subject: `Recuperação de senha ${env.app_name}`,
                    template: 'recover-pass',
                    context: { token: token }
                }, (error) => {
                    return error ?
                        res.status(400).json({ error: error }) :
                        res.status(201).send({ message: "SEND MAIL SUCCESS" });
                })
            }

        } catch (e) {
            console.log(e)
            return res.status(500).json({ error: e })
        }
    }
}

module.exports = AuthController