var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CantonSchema = new Schema({
    COD_CANTON: {
        type: Number,
        unique: true,
        trim: true
    },
    NOM_CANTON: {
        type: String,
        trim: true
    },
    PROVINCE: {
        _id: String,
        COD_PROVINCIA: Number,
        NOM_PROVINCIA: String
    }
});
mongoose.model('Canton', CantonSchema);