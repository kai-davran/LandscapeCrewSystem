// src/pages/Billing.js
import React from 'react';
import Navbar from "../../components/Navbar/Navbar";


const Billing = () => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f4f8',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    },
    heading: {
      fontSize: '3em',
      color: '#333'
    },
    comingSoon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '20px',
      fontSize: '1.5em',
      color: '#555'
    },
    emoji: {
      fontSize: '2em',
      margin: '0 10px'
    },
    text: {
      margin: 0,
      fontWeight: 'bold'
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Billing</h1>
        <div style={styles.comingSoon}>
          <span role="img" aria-label="rocket" style={styles.emoji}>🚀</span> 
          <p style={styles.text}>Coming Soon</p>
          <span role="img" aria-label="rocket" style={styles.emoji}>🚀</span>
        </div>
      </div>
    </>

  );
};

export default Billing;
