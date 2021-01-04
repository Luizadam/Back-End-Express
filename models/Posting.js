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
   
    postImage:{
        type:String
    },
    createdBy:{
        type:ObjectId
    },
    createdByName:{
        type:String
    },
     likes:[{type:ObjectId,ref:"User"}],
     comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"},
        postedByName:{type:String,ref:"User"}
    }],
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('posts',PostSchema);