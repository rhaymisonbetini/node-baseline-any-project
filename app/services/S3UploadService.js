'use strict'
const fs = require('fs');
const env = require('../../config/env.json');
const S3 = require('../../config/s3');

class S3UploadService {

    async uploadBase64(file) {
        const bucketS3 = env.s3_bucket;
        const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        let response = await this.uploadS3(buffer, bucketS3, env.s3_general_path);
        return response.Location;
    }

    async uploadfile(file) {
        const bucketS3 = env.s3_bucket;
        const buffer = file.file.data;
        let response = await this.uploadS3(buffer, bucketS3, env.s3_general_path);
        return response.Location;
    }

    async uploadS3(file, bucket, path) {
        const s3 = await S3.getS3();
        const params = {
            Bucket: bucket,
            Key: `${path}` + await this.create_UUID(),
            Body: file,
        };
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err.message);
                }
                resolve(data);
            });
        });
    }

    async create_UUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

}

module.exports = S3UploadService