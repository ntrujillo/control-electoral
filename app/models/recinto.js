var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RecintoSchema = new Schema({

    name: {
        type: String,
        trim: true
    },
    code: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        trim: true
    },
    actas: {
        type: Number,
        trim: true
    },
    resto: {
        type: String,
        trim: true
    },
    lat_recinto: {
        type: Number,
        trim: true
    },
    long_recinto: {
        type: Number,
        trim: true
    },
    zona: {type: mongoose.Schema.Types.ObjectId, ref: 'Zona'},
    juntas: [{type: mongoose.Schema.Types.ObjectId, ref: 'Junta'}]

});
RecintoSchema.index({code: 1, zona: 1}, {unique: true});
mongoose.model('Recinto', RecintoSchema);