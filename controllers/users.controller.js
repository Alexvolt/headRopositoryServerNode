﻿var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var credentialsService = require('services/credentials.service');
var errorService = require('services/error.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function authenticate(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                res.send(user);
            } else {
                // authentication failed
                res.status(403).send(errorService.userErrorForSending('Username or password is incorrect'));
            }
        })
        .catch(function (err) {
            res.status(400).send(errorService.errorForSending(err));
        });
}

function register(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(errorService.errorForSending(err));
        });
}

function getAll(req, res) {
    if (credentialsService.isAdmin(credentialsService.getTokenFromReq(req)))
        userService.getAll()
            .then(function (users) {
                res.send(users);
            })
            .catch(function (err) {
                res.status(400).send(errorService.errorForSending(err));
            });
    else
        res.status(403).send(errorService.userErrorForSending("Просмотр списка пользователей доступен только админу"));    
}

function getCurrent(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(errorService.errorForSending(err));
        });
}

function update(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(errorService.errorForSending(err));
        });
}

function _delete(req, res) {
    userService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(errorService.errorForSending(err));
        });
}