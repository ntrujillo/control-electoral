var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ZonaSchema = new Schema({
    COD_ZONA: {
        type: Number,
        trim: true
    },
    NOM_ZONA: {
        type: String,
        trim: true
    },
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
});
mongoose.model('Zona', ZonaSchema);