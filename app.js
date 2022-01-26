require('newrelic');

const path = require('path');

const express = require('express');
const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const morgan = require('morgan')

const router = require('./routes/routes')
const env = require('./config/env.json')

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(fileUpload({
    limits: { fileSize: 2 * 1024 * 1024 },
}));
app.use(morgan('dev'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/', router)

mongoose.connect(env.db_connection).then((_) => {
    const server = app.listen(8080)
    const io = require('./socket').init(server);
    io.on('connection', _ => {
        console.log('Client connected')
    })
}).catch(err => {
    console.error(err);
})