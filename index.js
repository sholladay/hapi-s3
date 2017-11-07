'use strict';

const Scube = require('scube');
const joi = require('joi');
const pkg = require('./package.json');

const register = (server, option, done) => {
    const { error, value : config } = joi.validate(option, joi.object().required().keys({
        bucket    : joi.string().required().hostname().min(1),
        publicKey : joi.string().required().token().min(20),
        secretKey : joi.string().required().base64().min(40)
    }));
    if (error) {
        done(error);
        return;
    }
    server.decorate('server', 's3', new Scube(config));
    done();
};

register.attributes = {
    pkg
};

module.exports = {
    register
};
