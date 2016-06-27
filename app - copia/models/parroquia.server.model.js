var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ParroquiaSchema = new Schema({
    COD_PARROQUIA: {
        type: Number,
        trim: true
    },
    NOM_PARROQUIA: {
        type: String,
        trim: true
    },
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
});
mongoose.model('Parroquia', ParroquiaSchema);