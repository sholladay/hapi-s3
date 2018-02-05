'use strict';

const Scube = require('scube');
const joi = require('joi');
const pkg = require('./package.json');

const register = (server, option) => {
    const config = joi.attempt(option, joi.object().required().keys({
        bucket    : joi.string().required().hostname().min(1),
        publicKey : joi.string().required().token().min(20),
        secretKey : joi.string().required().base64().min(40),
        endpoint  : joi.string().optional()
    }));

    server.decorate('server', 's3', new Scube(config));
};

module.exports.plugin = {
    register,
    pkg
};
