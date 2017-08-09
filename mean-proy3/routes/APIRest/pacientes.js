var express = require('express');
var router = express.Router();
var Muestra = require('../../models/Muestra.js');
var Usuario = require('../../models/Usuario.js');
var generator = require('generate-password');
var nodemailer = require('nodemailer');
var CentroMed = require('../../models/CentroMed.js');
var authOperarioRuta = function(req, res, next) {

    if (req.session["rol"] != "operario") {
      res.sendStatus(401);
      return;
    }
    next();
};
//middleware centros medicos por que esta disponible tanto para operario como paciente
var authCentrosMed = function(req, res, next) {
  if ((req.session["rol"] == "paciente")||(req.session["rol"] == "operario")) {
    next();

  }else{
    res.sendStatus(401);
    return;
  }
};
var authPacienteRuta = function(req, res, next) {
    //console.log("este es un middleware");
    if (req.session["rol"] != "paciente") {
      res.sendStatus(401);
      return;
    }
    next();
};
//lista los usuarios pacientes
router.get('/enlistarPacientes',authOperarioRuta, function(req, res) {
    console.log('I received a get request');
    Usuario.find({ rol: "paciente" }, function(err, docs) {
        res.json(docs);
    });
});
router.get('/centrosMed',authCentrosMed, function(req, res) {
    console.log('I received a get request');
    CentroMed.find({}, function(err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

//obtiene todas las muestras por cedula
router.get('/muestrasPorPaciente',authPacienteRuta, function(req, res) {
    console.log('I received a get request');
    Muestra.find({
        cedula: req.session["cedula"]
    }, function(err, docs) {
        req.session.idMuestra = docs._id;
        res.json(docs);
    });
});
//obtiene una muestra para imprimir los resultados de los examenes
router.get('/examen/:id',authPacienteRuta, function(req, res) {
    var id = req.params["id"];
    console.log('I received a get request');
    Muestra.findById(id, function(err, docs) {
        // req.session.idMuestra=docs._id;
        res.json(docs);
    });
});
//borra un usuario paciente
router.delete('/:id',authOperarioRuta, function(req, res) {
    console.log('I received a delete request');
    Usuario.findOneAndRemove({ cedula: req.param("id") }, function(err) {
        if (err) throw err;
        // we have deleted the user
        console.log('Paciente borrado!');
    });
});

//crear paciente
router.post('/',authOperarioRuta,function(req, res) {
    var password = generator.generate({
        length: 8,
        numbers: true
    });

    console.log(password); // Your unique password

    console.log('I received a post request');
    Usuario.create({
        cedula: req.body.cedula,
        user: req.body.correo,
        password: password,
        rol: "paciente",
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        telefonos:req.body.telefono,
        direccion: req.body.direccion,
        foto: "/images/users/user-default.png",

    }, function(err, docs) {
        console.log(docs);
        res.json(docs);
    });

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'saludprimerosadaw@gmail.com',
            pass: 'dawsaludprimero'
        }
    });

    var mailOptions = {
        from: 'Salud Primero SA <saludprimerosadaw@gmail.com>',
        to: req.body.correo,
        subject: 'Notificación de registro como paciente en Salud Primero',
        text: 'Contraseña: ' + password,
        html: '<h1>Bienvenido '+req.body.nombres+' a Salud Primero S.A.</h1><p>Ingrese al sitio web con los siguientes datos: </p><ul><li>Usuario: '+req.body.correo+'</li><li>Contraseña: '+password+'</li></ul><p>Para ingresar haga click <a href="http://goo.gl/jAuCvt">aquí</a></p>',
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.redirect('/');
        } else {
            console.log('Mensaje enviado: ' + info.response);
            //res.redirect('/');
        }
    })
});

//Get de UN usuario paciente
router.get('/:id',authOperarioRuta, function(req, res) {
    console.log('I received a get request');
    Usuario.find({
        cedula: req.param("id")
    }, function(err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

//modificar UN usuario paciente
router.put('/modificar/:id',authOperarioRuta, function(req, res) {

    var cedula = req.body.cedula;
    var nombres = req.body.nombres;
    var correo = req.body.correo;
    var dir = req.body.direccion1;
    var ape = req.body.apellidos;
    var telefonos = req.body.telefono;
    Usuario.findOneAndUpdate({
        cedula: req.param("id")
    }, {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        direccion: req.body.direccion1,
        telefonos:telefonos
    }, function(err, docs) {
        if (err) throw err;

        // we have the updated user returned to us
        console.log(docs);
    });
});

//lista UN usuarios pacientes por cedula
router.get('/',authPacienteRuta, function(req, res) {
    console.log('I received a get request');
    Usuario.find({
        cedula: req.session["cedula"]
    }, function(err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

//modificar UN usuario paciente con SESSION
router.put('/',authPacienteRuta, function(req, res) {

    var nombres = req.body.nombres;
    var correo = req.body.correo;
    var dir = req.body.direccion1;
    var ape = req.body.apellidos;
    var tel=req.body.telefono;

    var path;

    // store upload image
    if (!req.files || req.files.fotoDePerfil.name === '') {
        // si no se cambio el path imagne
        console.log('paciente no cargo foto');
        path = req.body.foto;
    } else {
        var sampleFile = req.files.fotoDePerfil;
        console.log('FOTO UPLOAD');
        console.log(sampleFile);
        //para que sea unico defino como nombre de foto idPaciente.ext
        var filename = ''+sampleFile.name;
        var extname = filename.split('.').pop();

        var fileNameStored = ''+req.session["idPaciente"] + '.' + extname;

        path = '/images/users/'+fileNameStored;
        console.log(path);
        sampleFile.mv('./public'+path, function(err) {
            if (err) {
                console.log('no se movio a public');
                path = req.body.path;
            }
            else {
                console.log('uploaded in dir public');
            }
        });
    }

    Usuario.findByIdAndUpdate(req.session["idPaciente"], {
        $set: {
            nombres: nombres,
            apellidos: ape,
            correo: correo,
            direccion: dir,
            telefonos: tel,
            foto: path
        }
    }, function(err, doc) {
        if (err) {
            res.send(err);
        } else {
            res.json(doc);
        }
    });
});


module.exports = router;
