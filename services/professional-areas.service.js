const knex = require('./connection');

var errorService = require('services/error.service');

const service = {};

service.getAll = getAll;
service.getParents = getParents;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll(query) {
    return  knex.select('id', 'name', 'parentId', 'created_at').from('professionalAreas').orderBy('parentId').orderBy('name');
}

function getParents(query) {
    return  knex.select('id', 'name', 'created_at').from('professionalAreas').whereNull('parentId').orderBy('name');
}

function getById(id) {
    return knex.select('id', 'name', 'parentId', 'created_at', 'created_author', 'updated_at', 'updated_author').from('professionalAreas').where({id}).first();
 }

function create(params, created_byId) {
    return knex('professionalAreas').insert({
      name:       params.name,
      parentId:   params.parentId,
      created_by: created_byId,
    });
}

function update(id, params) {
    return knex('professionalAreas')
    .where({id: id})
    .update({
      name:       params.name,
      parentId:   params.parentId,
    });
}

function _delete(id) {
    return knex('professionalAreas')
    .where({id: id})
    .del();
}