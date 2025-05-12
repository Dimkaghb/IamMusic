import React, { useState, useEffect } from 'react'
import Navbar from '../Components/Navvbar';
import styles from './Main.module.css'
import SongCard from '../Components/SongCard';
import { useNavigate } from 'react-router-dom';
import AddSong from '../Components/AddSong';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo2.png'
import { API_BASE_URL } from '../config';

const Main = () => {
    
    const [songs, setSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [showAddSong, setShowAddSong] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/songs`);
            const songsData = response.data.map(song => ({
                img: song.image || logo,
                title: song.songTitle,
                author: song.songArtist,
                genre: song.songGenre,
                text: song.text
            }));
            setSongs(songsData);
            setFilteredSongs(songsData);
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        
        const filtered = songs.filter(song => 
            song.title.toLowerCase().includes(query) || 
            song.author.toLowerCase().includes(query)
        );
        setFilteredSongs(filtered);
    };

    const openAddSong = () => {
        setShowAddSong(true);
    };

    const closeAddSong = () => {
        setShowAddSong(false);
    };

    const handleSongAdded = () => {
        fetchSongs(); 
        closeAddSong();
    };

    return(
        <div>
            <Navbar/>
            
            <div className={styles.intro}>
                <p className={styles.introtext}>Search for songs, lyrics, and annotations here.</p>
                <div className={styles.search}>
                    <input 
                        type="text" 
                        placeholder='Search by song name or artist' 
                        className={styles.searchinput}
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <button className={styles.searchbtn}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                    </button>
                </div>
                <div className={styles.catalog}>
                    <button onClick={openAddSong} className={styles.addSongbtn}>Add Song</button>
            {showAddSong && <AddSong onClose={closeAddSong} onSongAdded={handleSongAdded} />}
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-bar-down" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5M8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6"/>
                        </svg>
                    </span>
                    
                    <div className={styles.songs}>
                        {filteredSongs.map((song, index) => (
                            <SongCard 
                                key={index}
                                img={song.img} 
                                title={song.title} 
                                author={song.author}
                                genre={song.genre}
                                text={song.text}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
