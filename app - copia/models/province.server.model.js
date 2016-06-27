var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProvinceSchema = new Schema({
    COD_PROVINCIA: {
        type: Number,
        unique: true,
        trim: true
    },
    NOM_PROVINCIA: {
        type: String,
        unique: true,
        trim: true
    }
});
mongoose.model('Province', ProvinceSchema);