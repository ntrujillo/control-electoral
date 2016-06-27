var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VotoValidosSchema = new Schema({
    NUM_VOTOS: {
        type: Number,
        trim: true
    },
    LISTA: {
        type: Schema.ObjectId, ref: 'Lista'
    }
});
mongoose.model('VotosValidos', VotoValidosSchema);