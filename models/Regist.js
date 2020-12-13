const mongoose = require('mongoose')


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const RegistSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }

})


module.exports = mongoose.model('regist',RegistSchema);