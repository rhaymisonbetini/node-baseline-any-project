const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Shema = mongoose.Schema

const userShema = new Shema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    remember_token:{
        type: String,
        required: false,
        select: false
    },
    avatar: {
        type: String,
        required: false
    },

}, { timestamp: true })

userShema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

module.exports = mongoose.model('User', userShema)