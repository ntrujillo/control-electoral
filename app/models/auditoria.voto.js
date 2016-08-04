var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AuditoriaVotoSchema = new Schema({
    junta: {type: mongoose.Schema.Types.ObjectId, ref: 'Junta'},
    votoAnterior: {type: Object},
    votoActual: {type: Object},
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    fecha: {
        type: Date,
        default: Date.now
    }
});
mongoose.model('AuditoriaVoto', AuditoriaVotoSchema);