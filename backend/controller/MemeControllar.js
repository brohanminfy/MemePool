// routes/meme.js
import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import Meme from '../models/MemeModel.js';

const router = express.Router();
router.post('/upload', upload.array('memes', 10), async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const imageUrls = req.files.map(file => file.path); // Cloudinary URL

    const existingUser = await Meme.findOne({ email });

    if (existingUser) {
      await Meme.updateOne(
        { email },
        {
          $push: { meme: { $each: imageUrls } },
          $set: { username }
        }
      );
      return res.status(200).json({ message: 'Images added to existing user' });
    }

    const newMeme = new Meme({ username, email, meme: imageUrls });
    await newMeme.save();

    return res.status(201).json({ message: 'New user and memes saved', data: newMeme });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

export default router;
