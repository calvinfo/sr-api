
var mustache = require('mustache'),
    urls     = require('./urls');


exports.teams = function (division) {

    return mustache.render(urls.teams, { division : division });
};


exports.team = function (division, id) {

    return mustache.render(urls.team, { division : division,
                                        id       : id        });
};