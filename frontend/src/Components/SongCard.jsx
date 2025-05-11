import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './SongCard.module.css'

const SongCard = (props) => {
    const navigate = useNavigate();

    const handleMoreClick = () => {
        navigate(`/song/${props.title}`, { 
            state: { 
                title: props.title,
                author: props.author,
                genre: props.genre,
                img: props.img,
                text: props.text
            }
        });
    };

    return(
        <div className={styles.card}>
            <img src={props.img} alt="" className={styles.songimg}/>
            <p className={styles.title}>{props.title}</p>
            <p className={styles.author}>{props.author}</p>
            <p className={styles.genre}>{props.genre}</p>
            <button className={styles.infobtn} onClick={handleMoreClick}>More</button>
        </div>
    );
}
 
export default SongCard;