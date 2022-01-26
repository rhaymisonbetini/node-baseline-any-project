'use strict'

const jwt = require('jsonwebtoken');
const env = require('../../config/env.json');

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).send({ error: 'unathorized' })
    }

    const parts = authHeader.split(' ');

    if (!parts.length === 2) {
        return res.status(401).send({ error: 'unathorized' })
    }

    const [bearer, token] = parts

    if (!/^Bearer$/i.test(bearer)) {
        return res.status(401).send({ error: 'unathorized' })
    }

    jwt.verify(token, env.api_key, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'unathorized' })
        req.userId = decoded.id
        return next()
    })

}