var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VotoSchema = new Schema({
    NULOS: {
        type: Number,
        trim: true
    },
    BLANCOS: {
        type: Number,
        trim: true
    },
    TOTAL_VOTOS: {
        type: Number,
        trim: true
    },
    VOT_VALIDOS: [{
        NUM_VOTOS: Number,
        LISTA: {type: Schema.ObjectId, ref: 'Lista'}
    }],
    JUNTA: {
        _id: String,
        NUM_JUNTA: Number,
        GENERO: String,
        NUM_EMPADR: Number,
        RECINTO: {
            _id: String,
            COD_RECINTO: Number,
            NOM_RECINTO: String,
            DIR_RECINTO: String,
            TEL_RECINTO: String,
            JUN_FEM: Number,
            JUN_MAS: Number,
            NUM_JUNR: Number,
            JUN_INIM: Number,
            JUN_FINM: Number,
            JUN_INIF: Number,
            JUN_FINF: Number,
            STATUS: String,
            ACTAS: String,
            RESTO: String,
            LAT_RECINTO: Number,
            LONG_RECINTO: Number,
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
        }
    }
});
mongoose.model('Voto', VotoSchema);