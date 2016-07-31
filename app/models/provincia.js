//mongoose es una libreria que me permite conectarme a MongoDB pero existen otras
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Provincia = new Schema({
    name: {
        type: String,
        trim: true
    },
    code: {
        type: String,
        unique: true,
        trim: true
    },
    region: {type: mongoose.Schema.Types.ObjectId, ref: 'Region'},
    cantones: [{type: mongoose.Schema.Types.ObjectId, ref: 'Canton'}]
});

Provincia.index({code: 1});

module.exports = mongoose.model('Provincia', Provincia);