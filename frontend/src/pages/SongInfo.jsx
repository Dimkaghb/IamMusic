import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navvbar';
import Annotation from '../Components/Annotation';
import styles from './SongInfo.module.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SongInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [lyrics, setLyrics] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [annotations, setAnnotations] = useState([]);
    const [newAnnotation, setNewAnnotation] = useState('');
    const [selectedTimestamp, setSelectedTimestamp] = useState('');
    const { user, isLoggedIn } = useAuth();
    const [aiInput, setAiInput] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    const { title, author, genre, img, text } = location.state || {};

    useEffect(() => {
        if (text) {
            setLyrics(text);
            setLoading(false);
        } else if (title && author) {
            const fetchLyrics = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`https://api.lyrics.ovh/v1/${author}/${title}`);
                    setLyrics(response.data.lyrics);
                    setError(null);
                } catch (err) {
                    setError('Failed');
                    console.log('Error', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchLyrics();
        }

        const fetchAnnotations = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/annotations/${title}/${author}`);
                setAnnotations(response.data);
            } catch (err) {
                console.error('Error fetching annotations:', err);
            }
        };

        if (title && author) {
            fetchAnnotations();
        }
    }, [title, author, text]);

    const handleAddAnnotation = async (e) => {
        e.preventDefault();
        if (!newAnnotation.trim() || !selectedTimestamp || !isLoggedIn) return;

        try {
            const response = await axios.post('http://localhost:3001/api/annotations', {
                songTitle: title,
                songArtist: author,
                timestamp: selectedTimestamp,
                text: newAnnotation,
                userId: user._id
            });

            setAnnotations([...annotations, response.data]);
            setNewAnnotation('');
            setSelectedTimestamp('');
        } catch (err) {
            console.error('Error adding annotation:', err);
            alert('Failed to add annotation. Please try again.');
        }
    };

    const handleDeleteAnnotation = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/annotations/${id}`, {
                data: { userId: user._id }
            });
            setAnnotations(annotations.filter(annotation => annotation._id !== id));
        } catch (err) {
            console.error('Error deleting annotation:', err);
            alert('Failed to delete annotation. Please try again.');
        }
    };

    const handleAiAnnotation = async () => {
        if (!aiInput.trim()) return;
        setAiLoading(true);
        setAiResponse("");
        try {
            const aiMessage = `Given these lyrics:\n${lyrics}\n\nUser prompt: ${aiInput}\n\nExplain this and give a short annotation in 2-5 sentences.`;
            const res = await axios.post("http://localhost:3001/api/ai/ai-annotation", { content: aiMessage });
            setAiResponse(res.data.annotation);
        } catch (err) {
            setAiResponse("Failed to get AI annotation.");
        } finally {
            setAiLoading(false);
        }
    };

    if (!location.state) {
        return (
            <div>
                <Navbar />
                <div className={styles.error}>Song information not found</div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.songHeader}>
                    <img src={img} alt={title} className={styles.albumArt} />
                    <div className={styles.songDetails}>
                        <h1 className={styles.title}>{title}</h1>
                        <h2 className={styles.artist}>{author}</h2>
                        <p className={styles.genre}>{genre}</p>
                    </div>
                </div>

                <div className={styles.contentWrapper}>
                    <div className={styles.lyricsSection}>
                        <h2>Lyrics</h2>
                        {loading ? (
                            <div className={styles.loading}>Loading lyrics...</div>
                        ) : error ? (
                            <div className={styles.error}>{error}</div>
                        ) : (
                            <div className={styles.lyrics}>
                                {lyrics.split('\n').map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.annotationsSection}>
                        <h2>Annotations</h2>
                        {isLoggedIn ? (
                            <form onSubmit={handleAddAnnotation} className={styles.annotationForm}>
                                <input
                                    type="text"
                                    placeholder="Enter timestamp (e.g., 0:45)"
                                    value={selectedTimestamp}
                                    onChange={(e) => setSelectedTimestamp(e.target.value)}
                                    className={styles.timestampInput}
                                />
                                <textarea
                                    placeholder="Write your annotation..."
                                    value={newAnnotation}
                                    onChange={(e) => setNewAnnotation(e.target.value)}
                                    className={styles.annotationInput}
                                />
                                <button type="submit" className={styles.addButton}>
                                    Add Annotation
                                </button>
                            </form>
                        ) : (
                            <p className={styles.loginPrompt}>
                                Please log in to add annotations
                            </p>
                        )}

                        <div className={styles.annotationsList}>
                            {annotations.map(annotation => (
                                <Annotation
                                    key={annotation._id}
                                    annotation={annotation}
                                    onDelete={handleDeleteAnnotation}
                                    currentUserId={user?._id}
                                />
                            ))}
                        </div> 
                        <div className={styles.aiAnnotationBox}>
                            <div className={styles.aiAnnotationTitle}>Ask Ai?</div>
                            <textarea
                                type="text"
                                className={styles.aiAnnotationInput}
                                value={aiInput}
                                onChange={e => setAiInput(e.target.value)}
                                disabled={aiLoading}
                            />
                            <button
                                className={styles.aiAnnotationBtn}
                                onClick={handleAiAnnotation}
                                disabled={aiLoading}
                            >
                                {aiLoading ? "Loading..." : "Ai annotation"}
                            </button>
                            <div className={styles.airesponce}>
                                {aiResponse || "Annotation will appear here..."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongInfo;
