
var _          = require('underscore'),
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
exports.fetch = function (options, callback) {

    if (_.isFunction(options)) {
        callback = options;
        options = {};
    }

    _.defaults(options, { division : 'open' });

    var url = urls.teams(options.division);

    phantom.getPage(url, function (err, page, status) {

        page.evaluate(function () {

            // TODO: find a better way to parse this guy.
            var els = document.getElementsByTagName('option');
            var output = [];

            for (var i = 0; i < els.length; i++) {
                output.push({ id    : els[i].value,
                              name  : els[i].text  });
            }

            return output;

        }, function (output) {

            // Filter out the bad options on the page.
            output = _.filter(output, function (team) {
                                            return team.id > 100; });
            callback(null, output);
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

    phantom.getPage(url, function (err, page, status) {

        // TODO: move this to an inject function.
        page.evaluate(function () {

            var scores      = $('.scores tr'),
                rosterRows  = $('.rosterrow'),
                title       = $('.pagetitle h2:last')[0];

            // Fill out team name
            var name = title.innerText;

            // Fill out roster
            var roster = [];

            $.each(rosterRows, function (index, row) {

                var number = row.children[0],
                    first  = row.children[1],
                    last   = row.children[2],
                    height = row.children[3];

                roster.push({
                    number : number.innerText.trim(),
                    first  : first.innerText.trim(),
                    last   : last.innerText.trim(),
                    height : height.innerText.trim()
                });
            });

            var tournament;
            var games = [];

            $.each(scores, function (index, row) {

                // Must be a tournament
                if (row.children.length === 1 &&
                    $(row).find('a').length > 0) {

                    var link = $(row).find('a')[0];
                    var tokens = link.href.split('/');
                    var id = _.last(tokens);
                    var name = link.text;

                    tournament = { id   : id,
                                   name : name };

                } else if (row.children.length === 3) {

                    var opLink = $(row.children[2]).find('a')[0],
                        opTokens = opLink.href.split('/');

                    var opponent = {
                        id   : _.last(opTokens),
                        name : opLink.text
                    };

                    var game = {
                        tournament : _.clone(tournament),
                        date       : row.children[0].innerText.trim(),
                        score      : row.children[1].innerText.trim(),
                        opponent   : opponent
                    };

                    games.push(game);
                }
            });

            return {
                name   : name,
                roster : roster,
                games  : games
            };

        }, function (output) {
            callback(null, output);
        });
    });
};
