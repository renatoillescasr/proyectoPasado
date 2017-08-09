var express = require('express');
var router = express.Router();
var MuestraController = require('../controllers/MuestraController.js');


var MuestraModel = require('../models/Muestra.js');
//operario
router.get('/', function(req, res, next) {
    res.render('operarios/pacientes', {
        title: 'Pacientes'
    });
});
router.get('/pacientes', function(req, res, next) {
    res.render('operarios/pacientes', {
        title: 'Pacientes'
    });
});
router.get('/paciente-crear', function(req, res, next) {
    res.render('operarios/paciente-crear', {
        title: 'Crear Paciente'
    });
});
router.get('/muestras', function(req, res, next) {
    res.render('operarios/muestras-index', {
        title: 'Muestras'
    });
});
router.get('/muestras/:id', function(req, res, next) {
    var id = req.params.id;
    MuestraModel.findOne({ _id: id }, function(err, Muestra) {
        if (err) {
            res.render('error', {
                title: 'Error db',
                message: 'Error when getting Muestra.',
                error: {status: 500},
                layout: false
            });
        }
        if (!Muestra) {
            res.render('error', {
                title: 'Muestra no disponible',
                message: 'Error when getting Muestra.',
                error: {status: 404},
                layout: false
            });
        }
        var examenes = Muestra.examenes;
        // Envia la vista muestra con datos de muestra
        res.render('operarios/muestra', {
            title: 'Detalles de la Muestra',
            muestra_id: id,
            examenes: examenes,
        });
    });
});
router.get('/muestra-crear', function(req, res, next) {
    res.render('operarios/muestra-crear', {
        title: 'Crear Muestra'
    });
});

router.get('/estadisticas', function(req, res, next) {
    res.render('operarios/estadisticas', {
        title: 'Estadisticas'
    });
});


module.exports = router;
