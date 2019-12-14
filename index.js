'use strict';

const Scube = require('scube');
const joi = require('@hapi/joi');
const pkg = require('./package.json');

const register = (server, option) => {
    const config = joi.attempt(option, joi.object().required());
    server.decorate('server', 's3', new Scube(config));
};

module.exports.plugin = {
    register,
    pkg
};
