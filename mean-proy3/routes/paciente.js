var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('pacientes/sucursales', {
        title: 'Sucursales',
        angular: ''
    });
});
router.get('/misdatos.ejs', function(req, res, next) {
    res.render('pacientes/misdatos', {
        title: 'Mis Datos'
    });
});
router.get('/misexamenes.ejs', function(req, res, next) {
    res.render('pacientes/misexamenes', {
        title: 'Mis Examenes'
    });
});

module.exports = router;
