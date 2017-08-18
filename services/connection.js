//const environment = process.env.NODE_ENV;
const environment = "development";
//console.log("env = " + environment);  console.log("env = " + process.env.NODE_ENV);
const config = require('../knexfile.js')[environment];
module.exports = require('knex')(config);