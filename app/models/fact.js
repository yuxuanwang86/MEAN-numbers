var mongoose = require('mongoose');

module.exports = mongoose.model('Fact', {
    date:{
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    }
});