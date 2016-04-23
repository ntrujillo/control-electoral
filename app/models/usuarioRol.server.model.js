var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UsuarioRolSchema = new Schema({
    ur_rol: {type: Schema.ObjectId, ref: 'Rol'},
    ur_user: {type: Schema.ObjectId, ref: 'User'}
});

UsuarioRolSchema.index({ur_user: 1, ur_rol: 1}, {unique: true});
mongoose.model('UsuarioRol', UsuarioRolSchema);