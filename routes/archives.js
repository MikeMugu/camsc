
/* GET news page. */
exports.get = function(req, res) {
    res.render('archives', {
        title: 'Archives' 
    });
}
