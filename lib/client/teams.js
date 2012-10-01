

/**
 * Returns a list of all teams for a division
 * @return {Array} teams
 * [
 *     {
 *         id   : String,
 *         name : String
 *      }
 * ]
 */
module.exports = function () {

    var els = $('.teamhalf .gwt-ListBox option');
    var output = [];

    $.each(els, function (index, el) {
        output.push({ id   : $(el).attr('value'),
                      name : el.text });
    });

    return output;
};



