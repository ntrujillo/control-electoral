var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var JuntaUserSchema = new Schema({
    id_user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    junta: [{type: mongoose.Schema.Types.ObjectId, ref: 'Junta'}]
});
JuntaUserSchema.index({id_user: 1}, {unique: true});
mongoose.model('JuntaUser', JuntaUserSchema);