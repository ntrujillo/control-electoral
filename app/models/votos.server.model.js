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
        type: mongoose.Schema.Types.ObjectId, ref: 'Junta'
    },
    FECHA_REGISTRO: {
        type: Date,
        default: Date.now
    }
});
mongoose.model('Voto', VotoSchema);