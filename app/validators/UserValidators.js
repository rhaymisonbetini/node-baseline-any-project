'use strict'
const re = /\S+@\S+\.\S+/;

exports.userValidator = async (request) => {
    if (!request.name ||
        request.name.length < 5 ||
        !request.password ||
        !request.email ||
        !re.test(request.email)
    ) {
        const error = new Error()
        error.message = 'Validations failerd'
        error.statusCode = 422
        throw error
    } else {
        return true;
    }
}

exports.userLoginValidator = async (request) => {
    if (
        !request.password ||
        !request.email ||
        !re.test(request.email)
    ) {
        const error = new Error()
        error.message = 'Validations failerd'
        error.statusCode = 422
        throw error
    } else {
        return true;
    }
}

exports.userEmailValidator = async (request) => {
    if (!request.email ||
        !re.test(request.email)) {
        const error = new Error()
        error.message = 'Validations failerd'
        error.statusCode = 422
        throw error
    } else {
        return true;
    }
}