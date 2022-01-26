'use strict'

const env = require('./env.json')
const AWS = require('aws-sdk');

exports.getS3 = async () => {
    return new AWS.S3({
        accessKeyId: env.s3_acess_key_id,
        secretAccessKey: env.s3_secret_acess_key,
    })
}