const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        minlength:3,
        maxlength:15,
        unique:true
    },
    name:{
        type: String,
        required: true,
        maxlength: 20,
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true,
        minlength:6,
    },
    profilePicture:{
        public_id:{
            type:String,  
            default: ''  
            },
            url:{
                type:String,
                default: ''
            },
    },
    coverPicture:{
        public_id:{
            type:String,
            default: ''    
            },
            url:{
                type:String,
                default: ''
            },
    },
    followers:{
        type: Array,
        default: []
    },
    followings:{
        type: Array,
        default: []
    },
    isAdmin:{
        type:Boolean,
        default: false,
    },
    desc:{
        type: String,
        maxlength: 50,
    },
    city:{
        type: String,
        max: 50,
    },
    from:{
        type: String,
        max: 50,
    },
    relationship:{
        type: Number,
        enum:[1,2,3]
    },
},
{timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);