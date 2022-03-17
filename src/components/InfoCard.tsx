import React from 'react'
import styles from '../styles/CardStyles.module.css';

interface InfoCardProps {
  title: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({title}) => {
    return (
      <div className={styles.card_container}>
        <h2 className={styles.info_title}>{title}</h2>
      </div>
    );
}