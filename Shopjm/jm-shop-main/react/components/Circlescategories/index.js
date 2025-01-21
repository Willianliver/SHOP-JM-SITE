import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './style.css';

const CustomHighlights = () => {
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(null); // Posição inicial do arrasto
  const [dragDistance, setDragDistance] = useState(0); // Distância do arrasto
  const carouselRef = useRef(null); // Referência para o container do carrossel

  const categoryImages = {
    "Quarto Infantil": 'https://tfdjho.vtexassets.com/arquivos/ids/160343',
    "Quarto": 'https://tfdjho.vtexassets.com/arquivos/ids/160345',
    "Sala de Estar": 'https://tfdjho.vtexassets.com/arquivos/ids/160347',
    "Escritório": 'https://tfdjho.vtexassets.com/arquivos/ids/160342',
    "Cozinha": 'https://tfdjho.vtexassets.com/arquivos/ids/160341',
    "Sala de Jantar": 'https://tfdjho.vtexassets.com/arquivos/ids/160346',
    "Área Externa": 'https://tfdjho.vtexassets.com/arquivos/ids/160339',
    "Banheiro": 'https://tfdjho.vtexassets.com/arquivos/ids/160340',
  };

  const itemsPerPage = isMobile ? 3 : categories.length;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    axios
      .get('/api/catalog_system/pub/category/tree/4?_=${Date.now()}')
      .then((response) => {
        const categoryData = response.data.find((item) => item.name === 'Shop JM');
        if (categoryData && categoryData.children) {
          const processedCategories = categoryData.children.map((child) => ({
            ...child,
            url: child.url.replace(/^https?:\/\/[^\/]+/, ''), // Torna URLs relativas, evita o bug de ir para a url errada
          }));
          setCategories(processedCategories);
        }
      })
      
      .catch((error) => {
        console.error('Erro ao buscar categorias:', error);
      });
  }, []);

  const infiniteCategories = isMobile ? [...categories, ...categories] : categories;

  const nextSlide = () => {
    setStartIndex((prevIndex) =>
      prevIndex + itemsPerPage >= infiniteCategories.length
        ? 0
        : prevIndex + itemsPerPage
    );
  };

  const prevSlide = () => {
    setStartIndex((prevIndex) =>
      prevIndex - itemsPerPage < 0
        ? infiniteCategories.length - itemsPerPage
        : prevIndex - itemsPerPage
    );
  };

  // Funções para arrastar
  const handleDragStart = (e) => {
    setDragStartX(e.clientX || e.touches[0].clientX);
  };

  const handleDragMove = (e) => {
    if (dragStartX !== null) {
      const currentX = e.clientX || e.touches[0].clientX;
      setDragDistance(currentX - dragStartX);
    }
  };

  const handleDragEnd = () => {
    if (dragDistance > 50) {
      prevSlide();
    } else if (dragDistance < -50) {
      nextSlide();
    }
    setDragStartX(null);
    setDragDistance(0);
  };

  const visibleCategories = infiniteCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div
      className={styles.carouselContainer}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      ref={carouselRef}
    >
    {isMobile && (
  <button className={styles.navButton} onClick={prevSlide}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.navIcon}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  </button>
)}
<div className={styles.highlightsWrapper}>
  {(isMobile ? visibleCategories : categories).map((category, index) => (
    <div key={index} className={styles.highlightItem}>
      <a href={category.url} className={styles.highlightCircle}>
        <img
          src={categoryImages[category.name] || '/path/to/default.png'}
          alt={category.name}
        />
      </a>
      <span className={styles.highlightTitle}>{category.name}</span>
    </div>
  ))}
</div>
{isMobile && (
  <button className={styles.navButton} onClick={nextSlide}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.navIcon}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </button>
)}

    </div>
  );
};

export default CustomHighlights;
