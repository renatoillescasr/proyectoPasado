var express = require('express');
var router = express.Router();

var laboratorio = require('../../models/laboratorio.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    console.log('I received a get request');
    laboratorio.find({}, function(err, docs) {
        res.json(docs);
    });
});

module.exports = router;
