var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Parroquia = new Schema({
    name: {
        type: String,
        trim: true
    },
    code: {
        type: String,
        unique: true,
        trim: true
    },
    canton: {type: mongoose.Schema.Types.ObjectId, ref: 'Canton'},
    zonas: [{type: mongoose.Schema.Types.ObjectId, ref: 'Zona'}]
});
Parroquia.index({code: 1});
mongoose.model('Parroquia', Parroquia);