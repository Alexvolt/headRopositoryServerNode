const jwt = require('jsonwebtoken');

const service = {};

service.isAdmin = isAdmin;
service.getTokenFromReq = getTokenFromReq;

module.exports = service;


/** check token: have a user admin rights
* @param token - JWT token or request with headders
*/
function isAdmin(token){
  tokenData = jwt.decode(token);
  if(tokenData.admin)
    return true;

  return false;
}

/** extracting the token from a request
* @param req - request to api
*/
function getTokenFromReq(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;    
}


