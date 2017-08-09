var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose');
var Usuario = require('../models/Usuario.js');

router.post('/', function(req, res) {
    var user = req.body.user;
    var password = req.body.pass;
    var rol = req.body.rol.toLowerCase();

    Usuario.findOne({
        $and: [{ user: user }, { password: password }, { rol: rol }]
    }, function(err, usuario) {
        if (err) {
            res.send("mal");
        } else {
            if (usuario) {
                
                req.session.cedula = usuario.cedula;
                req.session.rol = usuario.rol;
                req.session.idPaciente = usuario._id;
                res.send({
                    usuario: usuario
                });
            } else {
                res.send({
                    mensaje: "Usuario o Contraseña Inválidos, asegurese de elegir correctamente su rol",
                    error: "true"
                });
            }
        }
    });
})
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log("query get de usuarios con exito");
// });
module.exports = router;
