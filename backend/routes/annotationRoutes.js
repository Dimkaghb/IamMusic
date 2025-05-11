import express from 'express';
import Annotation from '../models/Annotation.js';

const router = express.Router();

router.get('/:songTitle/:songArtist', async (req, res) => {
    try {
        const annotations = await Annotation.find({
            songTitle: req.params.songTitle,
            songArtist: req.params.songArtist
        }).populate('userId', 'name');
        res.json(annotations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const annotation = new Annotation({
        songTitle: req.body.songTitle,
        songArtist: req.body.songArtist,
        timestamp: req.body.timestamp,
        text: req.body.text,
        userId: req.body.userId
    });

    try {
        const newAnnotation = await annotation.save();
        res.status(201).json(newAnnotation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const annotation = await Annotation.findById(req.params.id);
        if (!annotation) {
            return res.status(404).json({ message: 'Annotation not found' });
        }
        
        if (annotation.userId.toString() !== req.body.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this annotation' });
        }

        await annotation.remove();
        res.json({ message: 'Annotation deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;