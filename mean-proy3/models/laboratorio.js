var mongoose=require('mongoose');
var LaboratorioSchema=new mongoose.Schema({
  nombre: String,
    ciudad: String
}, { versionKey: false, collection: 'laboratorios'});

module.exports = mongoose.model("laboratorio",LaboratorioSchema);