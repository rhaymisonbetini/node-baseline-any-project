const path = require('path')
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const env = require('./env.json');

const transport = nodemailer.createTransport({
    host: env.mail_host,
    port: env.mail_port,
    auth: {
        user: env.mail_user,
        pass: env.mail_password
    }
});

transport.use('compile', hbs({
    viewEngine: {
        defaultLayout: undefined,
        partialsDir: path.resolve('./resources/mail/')
    },
    viewPath: path.resolve('./resources/mail/'),
    extName: '.html',
}));

module.exports = transport;