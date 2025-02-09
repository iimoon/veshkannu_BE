const mongoose=require('mongoose');
const userSchema =mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneno:{
        type:Number,
        required:true
    },
    class:{
        type:String,
        required:true
    },
    college:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Role:{
        type:String,
        default:"user"
    }
});
const userModel =mongoose.model('user',userSchema);
module.exports=userModel;