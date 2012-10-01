

/**
 * Page to scrape a particular team page from SR
 * @return {Object} team
 * {
 *     section : String,
 *     region  : String,
 *     name    : String,
 *     games   : [
 *         {
 *             date     : "August 11",
 *             opponent : {
 *                 id   : String,
 *                 name : String
 *             },
 *             sanctioned : Boolean,
 *             score : "12-11"
 *             tournament : {
 *                 id   : String,
 *                 name : String
 *             }
 *         }
 *     ],
 *     roster  : [
 *         {
 *             first  : String,
 *             height : String,
 *             last   : string,
 *             number : String
 *         }
 *     ]
 * }
 */
module.exports = function () {

    var scores      = $('.scores tr'),
        rosterRows  = $('.rosterrow'),
        title       = $('.pagetitle h2:last')[0],
        info        = $('.infotable td');

    var region  = info[1].innerText.trim(),
        section = info[3].innerText.trim();

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
                opponent   : opponent,
                sanctioned : $(row.children[2]).attr('class') === 'sanctioned'
            };

            games.push(game);
        }
    });

    return {
        name    : name,
        roster  : roster,
        games   : games,
        region  : region,
        section : section
    };

};


