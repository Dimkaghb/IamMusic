import mongoose from 'mongoose'

const songsSchema = new mongoose.Schema({
songTitle: {
        type: String,
        required: true
    },
    songArtist: {
        type: String,
        required: true
    },
    songGenre: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

const Songs = mongoose.model('Songs', songsSchema);
export default Songs;