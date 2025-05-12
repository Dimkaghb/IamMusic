import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

import annotationRoutes from './routes/annotationRoutes.js';
import songRoutes from './routes/songRoutes.js';
import aiAnnotationRoutes from './routes/aiAnnotationRoutes.js';
dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const app = express()
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: 'https://iammusic-frontend.onrender.com', 
  credentials: true 
}));

app.use('/api/users', userRoutes);
app.use('/api/annotations', annotationRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/ai', aiAnnotationRoutes);


app.listen(3001, ()=>{
    console.log("App has been started");
})

