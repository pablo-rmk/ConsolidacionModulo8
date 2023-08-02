const express = require('express');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys')

const verificacion = express.Router();

verificacion.use((req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log(token);
    if (!token) {
        res.status(401).send({
            error: 'Es necesario ingresar un token para la autenticación'
        });
        return
    };
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length)
        console.log(token);
    };
    if (token) {
        jwt.verify(token, keys.key, (err, decoded) => {
            if (err) {
                return res.status(418).send({
                    message: 'El token ingresado no es válido'
                });
            } else {
                req.decoded = decoded;
                next();
            };
        });
    };
});

module.exports = verificacion;
