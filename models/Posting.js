const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const PostSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
   
    // postImage:{
    //     type:String,
    //     required:true
    // },
    createdBy:{
        type:ObjectId
    },
     likes:[{type:ObjectId,ref:"User"}],
     comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"}
    }],
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('posts',PostSchema);