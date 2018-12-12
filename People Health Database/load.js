var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('mysql', mysql);
app.use('/', express.static('public'));

app.set('port', 32712);


process.on('uncaughtException', function (err) {
    console.log(err);
});

app.use('/disease', require('./disease.js'));

app.use('/continent', require('./continent.js'));

app.use('/people', require('./people.js'));

app.use('/status', require('./status.js'));

app.use('/people_status', require('./people_status.js'));



//handle error functions
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

//shows port # being used
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
