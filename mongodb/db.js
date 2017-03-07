// the middleware function
module.exports = function() {
    var mongoose = require('mongoose'); //require mongoose module
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
    var conn = mongoose.connect('mongodb://127.0.0.1/flipkart'); //connection to mongodb

    // create schema 
    var details = mongoose.Schema({}, {
        collection: 'details',
        strict: false
    });

    var fetch_data = conn.model('users', details);
    return function(req, res, next) {
        req.fetch = fetch_data;
        next();
    }
}
