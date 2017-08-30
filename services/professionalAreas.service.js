const knex = require('./connection');

var errorService = require('services/error.service');

const service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;


function getByName(name) {
  return knex('professionalAreas').where({name}).first();
}

function getAll(query) {
    return  knex.select('id', 'name', 'parentId', 'created_at').from('professionalAreas').orderBy('parentId').orderBy('id');
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