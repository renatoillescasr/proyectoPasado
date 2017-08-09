var mongoose = require('mongoose');
var MuestraSchema = new mongoose.Schema({
    fechaIngreso: {
        type: Date,
        default: Date.now
    },
    // examenes_realizados:Array,
    'estado': {
        type: String,
        enum: ['enviado', 'inconveniente', 'recibido', 'terminado'],
        default: 'enviado'
    }, //ojo cambiar de etapa en laboralorita(terminado),cuando recien se ingresa la muestra en operario(en proceso)
    tipo: String,
    lab_asignado: String,
    cod_barras: String,
    cedula: String,
    centro_medico: String,
    examenes: [{
        'nombre': String,
        'resultados': [{
            parametro: String,
            unidad: String,
            resultado: Number,
            val_ref: String
        }]
    }]
    //id_paciente: { type: Schema.ObjectId, ref: "paciente" }
}, {
    versionKey: false,
    collection: 'muestra'
});

module.exports = mongoose.model("Muestra", MuestraSchema);
