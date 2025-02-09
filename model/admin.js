const mongoose=require('mongoose');
const adminSchema =mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    
});
const adminModel =mongoose.model('logins',adminSchema);
module.exports=adminModel;