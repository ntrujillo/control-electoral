//mongoose es una libreria que me permite conectarme a MongoDB pero existen otras
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Region = new Schema({
    name: {
        type: String,
        trim: true
    },
    code: {
        type: String,
        unique: true,
        trim: true
    }
});

Region.index({code: 1});

module.exports = mongoose.model('Region', Region);