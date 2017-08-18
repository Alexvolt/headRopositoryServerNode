const service = {};

service.errorForSending = errorForSending;
service.userErrorForSending = userErrorForSending;

module.exports = service;

/** extracting the token from a request
* @param error - error object for sending
*/
function errorForSending(error){
  return userErrorForSending(error.message, error.name, error.code)
}

/** user error object for sending
*/
function userErrorForSending(message, name, code){
  errObj = {
    isError: true,
    message: message
  }; 
  if(name)
    errObj.name = name;  
  if(code)
    errObj.code = code;  
  return  errObj; 
}
