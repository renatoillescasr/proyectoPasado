var MuestraModel = require('../models/Muestra.js');

/**
 * MuestraController.js
 *
 * @description :: Server-side logic for managing Muestras.
 */
module.exports = {

    /**
     * MuestraController.list()
     */
    list: function(req, res) {
        MuestraModel.find(function(err, Muestras) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Muestra.',
                    error: err
                });
            }
            return res.json(Muestras);
        });
    },

    /**
     * MuestraController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        MuestraModel.findOne({ _id: id }, function(err, Muestra) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Muestra.',
                    error: err
                });
            }
            if (!Muestra) {
                return res.status(404).json({
                    message: 'No such Muestra'
                });
            }
            console.log('muestra desde MuestrasE');
            return res.json(Muestra);
        });
    },

    /**
     * MuestraController.create()
     */
    create: function(req, res) {
        var Muestra = new MuestraModel({
            fechaIngreso: req.body.fechaIngreso,
            estado: req.body.estado,
            tipo: req.body.tipo,
            lab_asignado: req.body.lab_asignado,
            cod_barras: req.body.cod_barras,
            cedula: req.body.cedula,
            centro_medico: req.body.centro_medico,
            examenes: req.body.examenes
        });

        Muestra.save(function(err, Muestra) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Muestra',
                    error: err
                });
            }
            return res.status(201).json(Muestra);
        });
    },

    /**
     * MuestraController.update()
     */
    update: function(req, res) {
        console.log("req para actualizar muestras");
        var id = req.params.id;
        MuestraModel.findOne({ _id: id }, function(err, Muestra) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Muestra',
                    error: err
                });
            }
            if (!Muestra) {
                return res.status(404).json({
                    message: 'No such Muestra'
                });
            }

            Muestra.fechaIngreso = req.body.fechaIngreso ? req.body.fechaIngreso : Muestra.fechaIngreso;
            Muestra.estado = req.body.estado ? req.body.estado : Muestra.estado;
            Muestra.tipo = req.body.tipo ? req.body.tipo : Muestra.tipo;
            Muestra.lab_asignado = req.body.lab_asignado ? req.body.lab_asignado : Muestra.lab_asignado;
            Muestra.cod_barras = req.body.cod_barras ? req.body.cod_barras : Muestra.cod_barras;
            Muestra.cedula = req.body.cedula ? req.body.cedula : Muestra.cedula;
            Muestra.centro_medico = req.body.centro_medico ? req.body.centro_medico : Muestra.centro_medico;

            var resultadosExamenes = req.body.muestraResults;

            if (resultadosExamenes === undefined || resultadosExamenes === null) {
                Muestra.examenes = req.body.examenes ? req.body.examenes : Muestra.examenes;
            } else {
                console.log("se puede acualzar los resultados");
                var examenes = Muestra.examenes;
                var i = 0;
                examenes.forEach(function(examen){
                    resultadosExamen = resultadosExamenes[i].resultados;
                    examen.resultados = resultadosExamen;
                    i = i + 1;
                });
                // si ya se ingresan los resultados actualiza estado
                Muestra.estado = 'terminado'
            }

            Muestra.save(function(err, Muestra) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Muestra.',
                        error: err
                    });
                }
                return res.json(Muestra);
            });
        });
    },

    /**
     * MuestraController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        MuestraModel.findByIdAndRemove(id, function(err, Muestra) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Muestra.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
