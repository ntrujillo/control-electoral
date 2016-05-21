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
    jun_fem: {
        type: Number,
        trim: true
    },
    jun_mas: {
        type: Number,
        trim: true
    },
    num_junr: {
        type: Number,
        trim: true
    },
    jun_inim: {
        type: Number,
        trim: true
    },
    jun_finm: {
        type: Number,
        trim: true
    },
    jun_inif: {
        type: Number,
        trim: true
    },
    jun_finf: {
        type: Number,
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