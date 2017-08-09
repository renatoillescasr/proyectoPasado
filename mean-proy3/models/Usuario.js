var mongoose=require('mongoose');
var UsuarioSchema=new mongoose.Schema({
  fechaIngreso :{type:Date,default:Date.now},

  cedula:String,
  user:String,
  password : String,
  rol:String ,// si es laboratorista se pone de q lab es?
  nombres:String,
  apellidos:String,

  correo :String,
  direccion :String,//(Opcional)
  telefonos:Array,//(Opcional)
  foto:String //(Opcional)
}, { versionKey: false, collection: 'usuario'});

module.exports = mongoose.model("Usuario",UsuarioSchema);
