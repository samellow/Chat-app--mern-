import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'
import connectToMongoDB from './db/connectToMongoDb.js';

const app = express()
const PORT = process.env.PORT || 5000

dotenv.config();

//middleware
app.use(express.json());
app.use('/api/auth', authRoutes)

app.get('/', (req,res)=>{
    res.send('Hello there')
})


app.listen(PORT,()=>{
    connectToMongoDB()
    console.log('server is running on ' + PORT)
})