const express =require('express');
const morgon=require('morgan');
const cors =require('cors');
PORT =3008;
require('./db/connection')
const userRoutes =require('./Routes/userRoute')
const postRoutes =require('./Routes/postRoutes')
const adminRoutes =require('./Routes/adminRoutes')
const cartRoutes = require('./Routes/cartRoute')
const orderRoutes = require('./Routes/orderRoutes')

const app = express();
app.use(morgon('dev'));
app.use(cors());
app.use('/api',userRoutes)
app.use('/api',postRoutes)
app.use('/api',adminRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api',orderRoutes)

app.listen(PORT,()=>{
    console.log(`listening to ${PORT}`)
})