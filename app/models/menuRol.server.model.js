var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MenuRolSchema = new Schema({
    mr_menu: {type: Schema.ObjectId, ref: 'Menu'},
    mr_rol: {type: Schema.ObjectId, ref: 'Rol'}
});
MenuRolSchema.index({mr_menu: 1, mr_rol: 1}, {unique: true});
mongoose.model('MenuRol', MenuRolSchema);