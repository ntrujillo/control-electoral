var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var JuntaSchema = new Schema({
    gender: {
        type: String,
        trim: true
    },
    junta: {
        type: String,
        trim: true
    },
    empadronados: {
        type: Number,
        trim: true
    },
    status: {
        type: String,
        default: 'NA'
    },
    recinto: {type: mongoose.Schema.Types.ObjectId, ref: 'Recinto'}

});
JuntaSchema.index({junta: 1, gender: 1, recinto: 1}, {unique: true});
mongoose.model('Junta', JuntaSchema);