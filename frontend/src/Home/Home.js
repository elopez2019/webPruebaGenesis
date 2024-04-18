import React from 'react';
import mariscosImage from '../img/mariscos.png';

function Home() {
    return (
        <div className="main-image-container" style={{ display: 'flex', justifyContent: 'center' }}>
            {/* Imagen principal */}
            <img src={mariscosImage} alt="Imagen Principal" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
    );            
}

export default Home;
