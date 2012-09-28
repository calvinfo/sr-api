
var _       = require('underscore'),
    async   = require('async'),
    phantom = require('phantom');


var jquery     = "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js",
    underscore = "http://underscorejs.org/underscore-min.js";

var plugins = [jquery, underscore];


/**
 * Returns a particular callback. For some reason just creating many pages
 * crashes the phantomjs process. I'll investigate later.
 * @param  {Function} callback (err, page, done) - call done to cleanup
 */
exports.getPage = function (url, callback) {

    phantom.create(function (client) {

        client.createPage(function (page) {

            var done = function () { // give cleanup function.
                page.release();
                client.exit();
            };

            page.open(url, function (status) {

                async.map(plugins, function (item, cb) {
                    page.includeJs(item, function () { cb(); });
                },
                    function onComplete() {
                    return callback(null, page, done);
                });
            });
        });
    });
};