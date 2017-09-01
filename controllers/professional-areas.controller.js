var config = require('config.json');
var express = require('express');
var router = express.Router();
var dataService = require('services/professional-areas.service');
var credentialsService = require('services/credentials.service');
var errorService = require('services/error.service');

// routes
router.get('/parents', getParents);
router.get('/', getAll);
router.get('/:_id', getById);
router.post('/', create);
router.put('/:_id', update);
router.delete('/:_id', _delete);


module.exports = router;

function credentialsCheckAndForbiddenErrorSending(req, res) {
  if (credentialsService.canEditReferences(req))  
    return true;
  else
    res.status(403).send(errorService.userErrorForSending("Редактирование справочника доступно только админу"));    
}

function create(req, res) {
  if (credentialsCheckAndForbiddenErrorSending(req, res))
    dataService.create(req.body, req.user.sub)
      .then(() => {res.sendStatus(200);})
      .catch((err) => {res.status(400).send(errorService.errorForSending(err));});
}

function getAll(req, res) {
  dataService.getAll(req.query)
    .then((users) => {res.send(users);})
    .catch((err) => {res.status(400).send(errorService.errorForSending(err));});
}

function getParents(req, res) {
  dataService.getParents(req.query)
    .then((users) => {res.send(users);})
    .catch((err) => {res.status(400).send(errorService.errorForSending(err));});
}

function getById(req, res) {
  dataService.getById(req.params._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {res.status(400).send(errorService.errorForSending(err));});
}

function update(req, res) {
  if (credentialsCheckAndForbiddenErrorSending(req, res))
    dataService.update(req.params._id, req.body)
      .then(() => {res.sendStatus(200);})
      .catch((err) => {res.status(400).send(errorService.errorForSending(err));});
}

function _delete(req, res) {
  if (credentialsCheckAndForbiddenErrorSending(req, res))
    dataService.delete(req.params._id)
      .then(() => {res.sendStatus(200);})
      .catch((err) => {res.status(400).send(errorService.errorForSending(err));});
}
    