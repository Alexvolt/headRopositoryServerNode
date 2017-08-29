const jwt = require('jsonwebtoken');

const service = {};

service.isAdmin = isAdmin;
//service.getTokenFromReq = getTokenFromReq;

module.exports = service;


/** check token: have a user admin rights
* @param req - http request
*/
function isAdmin(req){
  if(req.user && req.user.admin)
    return true;

  return false;
}

/** extracting the token from a request
* @param req - request to api
*/
/*function getTokenFromReq(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;    
}*/


