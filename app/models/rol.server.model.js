var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RolSchema = new Schema({
    ro_rol: {type: Number, unique: true, required: 'Rol is required'},
    ro_description: {type: String, trim: true},
    ro_created: {type: Date, default: Date.now},
    ro_creator: {type: Schema.ObjectId, ref: 'User'},
    ro_status: {type: String, default: 'V', required: 'Status is required'}
});

mongoose.model('Rol', RolSchema);