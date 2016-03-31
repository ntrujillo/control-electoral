var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RecintoSchema = new Schema({

    COD_RECINTO: {
        type: Number,
        unique: true,
        trim: true
    },
    NOM_RECINTO: {
        type: String,
        trim: true
    },
    DIR_RECINTO: {
        type: String,
        trim: true
    },
    TEL_RECINTO: {
        type: String,
        trim: true
    },
    JUN_FEM: {
        type: Number,
        trim: true
    },
    JUN_MAS: {
        type: Number,
        trim: true
    },
    NUM_JUNR: {
        type: Number,
        trim: true
    },
    JUN_INIM: {
        type: Number,
        trim: true
    },
    JUN_FINM: {
        type: Number,
        trim: true
    },
    JUN_INIF: {
        type: Number,
        trim: true
    },
    JUN_FINF: {
        type: Number,
        trim: true
    },
    STATUS: {
        type: String,
        trim: true
    },
    ACTAS: {
        type: Number,
        trim: true
    },
    RESTO: {
        type: String,
        trim: true
    },
    LAT_RECINTO: {
        type: Number,
        trim: true
    },
    LONG_RECINTO: {
        type: Number,
        trim: true
    },
    ZONA: {
        _id: String,
        COD_ZONA: Number,
        NOM_ZONA: String,
        PARROQUIA: {
            _id: String,
            COD_PARROQUIA: Number,
            NOM_PARROQUIA: String,
            CANTON: {
                _id: String,
                COD_CANTON: Number,
                NOM_CANTON: String,
                PROVINCE: {
                    _id: String,
                    COD_PROVINCIA: Number,
                    NOM_PROVINCIA: String
                }
            }
        }
    }
});
mongoose.model('Recinto', RecintoSchema);