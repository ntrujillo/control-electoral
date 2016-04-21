var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MenuSchema = new Schema({
    mn_id: {type: Number},
    mn_parent: {type: Number, default: null},
    mn_icon: {type: String},
    mn_state: {type: String},
    mn_url: {type: String},
    mn_title: {type: String}
});
MenuSchema.index({mn_id: 1, mn_parent: 1, mn_state: 1}, {unique: true});
mongoose.model('Menu', MenuSchema);