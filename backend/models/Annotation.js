import mongoose from 'mongoose';

const annotationSchema = new mongoose.Schema({
    songTitle: {
        type: String,
        required: true
    },
    songArtist: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Annotation', annotationSchema);