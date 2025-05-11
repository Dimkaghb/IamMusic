import express from 'express';
import Songs from '../models/Songs.js';

const router = express.Router();

// Add a new song
router.post('/', async (req, res) => {
    try {
        const song = new Songs({
            songTitle: req.body.title,
            songArtist: req.body.author,
            songGenre: req.body.genre,
            text: req.body.lyrics,
            userId: req.body.userId,
            image: req.body.image // Save image
        });

        const newSong = await song.save();
        res.status(201).json(newSong);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all songs
router.get('/', async (req, res) => {
    try {
        const songs = await Songs.find();
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router; 