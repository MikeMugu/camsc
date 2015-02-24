
/* GET news page. */
exports.get = function(req, res) {
    res.render('directory', {
        title: 'Directory' 
    });
}
