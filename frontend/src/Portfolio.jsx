// src/components/Portfolio.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Portfolio.css';



function PortfoleoIMG() {
  const [images, setImages] = useState([]);
  
  const handleImageUpload = (e) => {
    const files = e.target.files;
    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      newImages.push(URL.createObjectURL(files[i]));
    }
    setImages([...images, ...newImages]);
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/profile');
  };

  return (
    <div className="portfolio-container">
      <div className="header">
        <h1>Мое Портфолио</h1>
        <button className="logout-button" onClick={handleLogout}>Вернуться</button>
      </div>
      <div className="portfolio-grid">
        {images.map((image, index) => (
          <div key={index} className="portfolio-item">
            <img src={image} alt={`portfolio-item-${index}`} />
          </div>
        ))}
      </div>

        <input className='input-image-port'
          type="file" 
          multiple 
          accept="image/*"
          id="file-input"
          onChange={handleImageUpload} 
        />

    </div>
  );
}

export default PortfoleoIMG;
