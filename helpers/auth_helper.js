var crypto = require('crypto');

auth_helper = function () {

};

auth_helper.prototype.getAuthKey = function () {
  return crypto.randomBytes(20).toString('hex');
};

module.exports.auth_helper = auth_helper;
