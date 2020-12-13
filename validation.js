const Joi = require("@hapi/joi");


const registerValidate = data => {
    const schema = Joi.object ({
    fullname: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    role:Joi.string().min(4).required(),
    });
    return schema.validate(data)
}

const loginValidate = data => {
    const schema = Joi.object ({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    });
    return schema.validate(data)
}
module.exports.registerValidate = registerValidate;
module.exports.loginValidate = loginValidate;