'use strict';



const switches = require('../switches')
const const_val = require('../common/const_val')
const db = {}

if (switches.DB === const_val.DATABASE_MYSQL) {
    // TODO
} else if (switches.DB === const_val.DATABASE_MONGO) {
    const mongo = require('./mongo')
    db.mongoModels = mongo;
}

module.exports = db;
