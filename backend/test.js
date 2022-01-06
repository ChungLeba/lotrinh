
var crypto = require("crypto")
let salt = crypto.randomBytes(32).toString('hex');
console.log(salt)
let hash_check = crypto.pbkdf2Sync("123456", salt, 2000, 64,'sha512')
hash_check = hash_check.toString('hex')
console.log(hash_check)