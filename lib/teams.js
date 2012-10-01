
var _          = require('underscore'),
    client     = require('./client'),
    phantom    = require('./phantom'),
    urls       = require('./urls');

/**
 * Fetch a list of all teams for a particular division. Returns an array
 * of teams in the form: { id : String, name : String }
 *
 * @param  {Object}   options  [description]
 *     @option  {String}  division (open)
 * @param  {Function} callback (err, teams)
 */
exports.all = function (options, callback) {

    if (_.isFunction(options)) {
        callback = options;
        options = {};
    }

    _.defaults(options, { division : 'open' });

    var url = urls.teams(options.division);

    phantom.getPage(url, function (err, page, done) {

        page.evaluate(client.teams, function (output) {

            callback(null, output);
            done();
        });
    });
};


/**
 * Get a particular team's results.
 * @param  {String}   division
 * @param  {String}   id
 * @param  {Function} callback (err, team)
 */
exports.get = function (division, id, callback) {

    var url = urls.team(division, id);

    phantom.getPage(url, function (err, page, done) {

        // TODO: move this to an inject function.
        page.evaluate(client.team, function (team) {

            _.extend(team, { id         : id,
                             division   : division });

            callback(null, team);
            done();
        });
    });
};
