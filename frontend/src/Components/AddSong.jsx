import React, { useState } from 'react'
import styles from './AddSong.module.css'
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const AddSong = ({ onClose, onSongAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    lyrics: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [fetchingLyrics, setFetchingLyrics] = useState(false);
  const [fetchLyricsError, setFetchLyricsError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user || !user._id) {
      setError('You must be logged in to add a song.');
      return;
    }

    try {
      const songData = {
        title: formData.title,
        author: formData.author,
        genre: formData.genre,
        lyrics: formData.lyrics,
        userId: user._id,
        image: imagePreview
      };

      await axios.post(`${API_BASE_URL}/api/songs`, songData);
      onSongAdded(); 
    } catch (err) {
      setError('Failed to add song. Please try again.');
      console.error('Error adding song:', err);
    }
  };

  const handleFetchLyrics = async () => {
    setFetchingLyrics(true);
    setFetchLyricsError('');
    try {
      const response = await axios.get(`https://api.lyrics.ovh/v1/${formData.author}/${formData.title}`);
      setFormData(prev => ({ ...prev, lyrics: response.data.lyrics }));
    } catch (err) {
      setFetchLyricsError('Lyrics not found or error fetching from internet.');
    } finally {
      setFetchingLyrics(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closebtn} onClick={onClose}>×</button>
        <h1 className={styles.title}>Add New Song</h1>
        {error && <div className={styles.error}>{error}</div>}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="text"
              name="title"
              placeholder="Song Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <input
              className={styles.input}
              type="text"
              name="author"
              placeholder="Artist Name"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
            <input
              className={styles.input}
              type="text"
              name="genre"
              placeholder="Genre"
              value={formData.genre}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.imageUpload}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="imageInput"
            />
            <label htmlFor="imageInput">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
              ) : (
                <div>
                  <p>Click to upload song cover image</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>Recommended size: 500x500px</p>
                </div>
              )}
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <textarea
              className={styles.textarea}
              name="lyrics"
              placeholder="Enter song lyrics..."
              value={formData.lyrics}
              onChange={handleInputChange}
              required
              style={{ flex: 1 }}
            />
            <button type="button" onClick={handleFetchLyrics} disabled={fetchingLyrics} className={styles.searchint}>
              {fetchingLyrics ? 'Fetching...' : 'Get Lyrics from Internet'}
            </button>
          </div>
          {fetchLyricsError && <div className={styles.error}>{fetchLyricsError}</div>}

          <button type="submit" className={styles.submitBtn} disabled={!user || !user._id}>
            Add Song
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddSong;