const config = require('config.json');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const knex = require('./connection');

var errorService = require('services/error.service');

const service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password) {
    return getUser(username)
    .then((user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
            return Promise.resolve({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: jwt.sign({ sub: user.id, admin: false}, config.secret, { expiresIn: '240h' })
            });
        } else {
            // authentication failed
            return Promise.resolve();
        }    
    })
    .catch((err) => {
        return Promise.reject(errorService.errorForSending(err));
    });
}

function getUser(username) {
  return knex('users').where({username}).first();
}

function getAll() {
    return knex.select('id', 'username', 'firstName', 'lastName', 'admin').from('users'); 
}

function getById(id) {
    return knex.select('id', 'username', 'firstName', 'lastName', 'admin').from('users').where({id}).first();
 }

async function create(userParam) {
    try {
        const user = await getUser(userParam.username);
        if (user) {
            throw new Error('User name already exists');
        } else {
            const hash = bcrypt.hashSync(userParam.password, 10);
            // not exists 
            const userData = {
                    username:  userParam.username,
                    firstName: userParam.firstName,
                    lastName:  userParam.lastName,
                    password:  hash
                };
            return knex('users')
                .insert(userData);
        };   
        
    } catch (error) {
        return Promise.reject(errorService.errorForSending(error)); 
    }

}

function update(id, userParam) {
    return knex('users')
    .where({id: id})
    .update({
                username:  userParam.username,
                firstName: userParam.firstName,
                lastName:  userParam.lastName,
    });
}

function _delete(id) {
    return knex('users')
    .where({id: id})
    .del();
}