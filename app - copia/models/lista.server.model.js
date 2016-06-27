var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ListaSchema = new Schema({
    CODE_LISTA: {
        type: Number,
        unique: true,
        trim: true
    },
    NOM_LISTA: {
        type: String,
        trim: true
    },
    NOM_PRE: {
        type: String,
        trim: true
    },
    NOM_VIC: {
        type: String,
        trim: true
    }
});

ListaSchema.virtual('votos').get(function () {
    return 0;
});


ListaSchema.set('toJSON', {
    virtuals: true
});
mongoose.model('Lista', ListaSchema);