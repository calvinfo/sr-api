
var _       = require('underscore'),
    async   = require('async'),
    phantom = require('phantom');


var client,
    callbacks = [];

/**
 * Create our client by default so we don't have phantoms all over the place.
 */
phantom.create(function (instance) {

    client = instance;

    _.each(callbacks, function (callback) {
        return callback(null, client);
    });
});


/**
 * Gets a phantom instance, otherwise queues until one is available.
 * @param  {Function} callback (err, client)
 */
var get = exports.get = function (callback) {

    if (client) {
        return callback(null, client);
    } else {
        callbacks.push(callback);
    }
};


var jquery     = "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js",
    underscore = "http://underscorejs.org/underscore-min.js";


/**
 * Returns a particular callback
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.getPage = function (url, callback) {

    get(function (err, client) {

        client.createPage(function (page) {

            page.open(url, function (status) {

                async.map([jquery, underscore], function (item, cb) {
                    page.includeJs(item, function () { cb(); });
                },
                    function onComplete() {

                    return callback(null, page, status);
                });
            });
        });
    });
};