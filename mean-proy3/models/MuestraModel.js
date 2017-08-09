/**
 * MuestraModel.js
 *
 * @description :: Model para una muestra con docs examenes embebidos. los
 * estados enviado, inconveniente equivale a (ingresado al sistema)
 * el laboratorista marca como recibido equivale a (en proceso)
 * el laboratorista ingresa resultados se actualiza a terminado.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MuestraSchema = new Schema({
    'fechaIngreso': { type: Date, default: Date.now },
    'estado': {
		type: String,
		enum: ['enviado', 'inconveniente', 'recibido', 'terminado'],
		default: 'enviado'
	},
	'tipo': String,
    'lab_asignado': String,
    'cod_barras': String,
    'cedula': String,
    'centro_medico': String,
    'examenes': [
		{
			'nombre': String,
			'resultados': [
				{
					parametro: String,
					unidad: String,
					resultado: Number,
					val_ref: String
				}
			]
		}
	]
}, { versionKey: false, collection: 'muestras'});

module.exports = mongoose.model('Muestra', MuestraSchema);
