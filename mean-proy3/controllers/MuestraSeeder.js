var MuestraModel = require('../models/Muestra.js');
var muestrasSeed = require('../seeds/muestras.json');
/**
 * MuestraSeeder.js
 *
 * @description :: Server-side logic for managing Muestras.
 */
module.exports = {
    seed: function(req, res) {
        MuestraModel.remove({}, function (err) {
            if (err) console.log("colecion no clean");
            else console.log("clear muestras");
        });
        MuestraModel.collection.insert(muestrasSeed, function(err, muestra){
            if (err) {
                return res.status(500).json({
                    message: 'Error al seed la collecion',
                    error: err
                });
            }
            return res.status(201).json({mensaje: 'Muestra collection seed'});
        })
    },
    dbreset: function(req, res){
        MuestraModel.remove({}, function (err) {
            if (err) console.log("colecion no clean");
            else {
                console.log("clear muestras");
                return res.status(201).json({mensaje: 'Muestra collection clear'});
            }
        });
    }
};
