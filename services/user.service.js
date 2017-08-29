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
            if(!user.haveAccess){
                return Promise.reject(errorService.userErrorForSending('access denied: admin must give full access for app first'));
            }
            return Promise.resolve({
                id: user.id,
                username:  user.username,
                firstName: user.firstName,
                lastName:  user.lastName,
                email:     user.email,
                token: jwt.sign({ sub: user.id, admin: user.admin}, config.secret, { expiresIn: '1h' })
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

function getAll(query) {
    let selectQ =  knex.select('id', 'username', 'firstName', 'lastName', 'email', 'admin', 'haveAccess').from('users');
    for (let key in query) {
        let val = query[key]
        switch(key) {
        case 'limit': 
            selectQ = selectQ.limit(val);
            break;
        case 'offset':  
            selectQ = selectQ.offset(val);
            break;
        case 'orderBy':  
            selectQ = selectQ.orderBy(val);
            break;
        case 'orderByDesc':  
            selectQ = selectQ.orderBy(val, 'desc');
            break;
        default:
            selectQ = selectQ.where(key, 'like', `%${query[key]}%`);
            //if(key.length > 4 && key.substr(key.length-4,4) == 'Like')
        }
    }
    if(!query.orderBy)
        selectQ = selectQ.orderBy('id');    
    return selectQ;
}

function getById(id) {
    return knex.select('id', 'username', 'firstName', 'lastName', 'email', 'admin', 'haveAccess').from('users').where({id}).first();
 }

async function create(userParam) {
    try {
        const user = await getUser(userParam.username);
        if (user) {
            throw new Error('User name already exists');
        } else {
            const existAdminUser = await knex('users').where({admin: true}).first();
            firstUser = !existAdminUser;

            const hash = bcrypt.hashSync(userParam.password, 10);
            // not exists 
            const userData = {
                    username:    userParam.username,
                    firstName:   userParam.firstName,
                    lastName:    userParam.lastName,
                    email:       userParam.email,
                    password:    hash,
                    admin:       firstUser,
                    haveAccess:  firstUser
                };
            return knex('users')
                .insert(userData);
        };   
        
    } catch (error) {
        return Promise.reject(errorService.errorForSending(error)); 
    }

}

function update(id, userParam, isAdmin) {
    let updateParams = {
                username:       userParam.username,
                firstName:      userParam.firstName,
                lastName:       userParam.lastName,
                email:          userParam.email
    }
    if(isAdmin){
        updateParams.admin = userParam.admin;    
        updateParams.haveAccess = userParam.haveAccess;    
    }

    return knex('users')
    .where({id: id})
    .update(updateParams);
}

function _delete(id) {
    return knex('users')
    .where({id: id})
    .del();
}