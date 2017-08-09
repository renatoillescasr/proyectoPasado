var express = require('express');
var router = express.Router();
var muestraSeeder = require('../controllers/MuestraSeeder.js');
var laboratorista = require('./laboratorista.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Salud Primero'
    });
});
var authOperarioRuta = function(req, res, next) {
    //console.log("este es un middleware");
    if (req.session["rol"] != "operario") {
      res.sendStatus(401);
      return;
    }
    next();
};
router.get('/logout',function(req,res){
	req.session.destroy();

  res.redirect("/");
});

var authOperarioVista = function(req, res, next) {
    //console.log("este es un middleware");
    if (req.session["rol"] != "operario") {
      res.redirect("/");
      return;
    }
    next();
};


var authPacienteVista = function(req, res, next) {
    //console.log("este es un middleware");
    if (req.session["rol"] != "paciente") {
      res.redirect("/");
      return;
    }
    next();
};
//middleware para q este disponible la ruta muestras tanto para operario y laboratorista
var authMuestrasRuta = function(req, res, next) {
    //console.log("este es un middleware");
    if ((req.session["rol"] == "laboratorista")||(req.session["rol"] == "operario")) {
      next();

    }else{
      res.sendStatus(401);
      return;
    }

};
var authLaboraVista = function(req, res, next) {
    //console.log("este es un middleware");
    if (req.session["rol"] != "laboratorista") {
      res.redirect("/");
      return;
    }
    next();
};

/*
 * View Routes
 */
router.use('/login', require('./usuarios.js'));


router.use('/laboratorista',authLaboraVista, require('./laboratorista.js'))
router.use('/operario',authOperarioVista, require('./operario.js'))
router.use('/paciente',authPacienteVista, require('./paciente.js'))

/*
 * APIRest Routes
 */

router.use('/laboratorios',authMuestrasRuta,require('./APIRest/laboratorios.js'));
router.use('/pacientes', require('./APIRest/pacientes.js'));
router.use('/muestras',authMuestrasRuta, require('./APIRest/muestras.js'));



// llena de datos la collecion Muestras.
router.get('/seed', function(req, res, next) {
    muestraSeeder.seed(req, res);
});
// limpia la tabla muestras.
router.get('/dbreset', function(req, res, next) {
    muestraSeeder.dbreset(req, res);
});

module.exports = router;
