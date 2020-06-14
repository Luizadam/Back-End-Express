const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    desc:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('posts',PostSchema);