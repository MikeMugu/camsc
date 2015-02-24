
/* GET standings page. */
exports.get = function(req, res) {
    res.render('standings', {
        title: 'Current Standings' 
    });
}
