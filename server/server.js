import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import userRoutes from './routes/userRoutes.js'

import connectToMongoDB from './db/connectToMongoDb.js';

const app = express()
const PORT = process.env.PORT || 5000

dotenv.config();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes )


app.get('/', (req,res)=>{
    res.send('Hello there')
})
 

app.listen(PORT,()=>{
    connectToMongoDB()
    console.log('server is running on ' + PORT)
})