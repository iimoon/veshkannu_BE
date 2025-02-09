const mongoose =require('mongoose')
mongoose.connect("mongodb+srv://swetha:ritika@swe.h2oj0ve.mongodb.net/canteen?retryWrites=true&w=majority&appName=swe")
.then(()=>{
    console.log("db connected")
})
.catch((error)=>{
    console.log(error)
})