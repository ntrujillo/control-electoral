var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ZonaSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    code: {
        type: String,
        trim: true
    },
    parroquia: {type: mongoose.Schema.Types.ObjectId, ref: 'Parroquia'},
    recintos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recinto'}]
});
ZonaSchema.index({code: 1, parroquia: 1}, {unique: true});
mongoose.model('Zona', ZonaSchema);