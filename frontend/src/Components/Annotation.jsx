import React from 'react';
import styles from './Annotation.module.css';

const Annotation = ({ annotation, onDelete, currentUserId }) => {
    const isOwner = annotation.userId && currentUserId && annotation.userId._id === currentUserId;

    return (
        <div className={styles.annotation}>
            <div className={styles.annotationHeader}>
                <div className={styles.annotationInfo}>
                    <span className={styles.timestamp}>{annotation.timestamp}</span>
                    <span className={styles.author}>by {annotation.userId?.name || 'Unknown'}</span>
                </div>
                {isOwner && annotation._id && (
                    <button 
                        className={styles.deleteBtn}
                        onClick={() => onDelete(annotation._id)}
                    >
                        ×
                    </button>
                )}
            </div>
            <p className={styles.annotationText}>{annotation.text}</p>
        </div>
    );
};

export default Annotation; 