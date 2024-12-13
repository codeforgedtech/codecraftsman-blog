import React, { useState } from 'react';
import AdsSection from '../Ads/adsPage';


const GalleryPage = () => {
  const images = [
    {
      src: 'https://codecraftsman.se/wallpaper/codecraftsman1t.jpg',
      alt: 'Wallpaper 1',
      link: 'https://codecraftsman.se/wallpaper/codecraftsman1.jpg',
    },
    {
      src: 'https://codecraftsman.se/wallpaper/codecraftsman2t.jpg',
      alt: 'Wallpaper 2',
      link: 'https://codecraftsman.se/wallpaper/codecraftsman2.jpg',
    },
    {
      src: 'https://codecraftsman.se/wallpaper/codecraftsman3t.jpg',
      alt: 'Wallpaper 3',
      link: 'https://codecraftsman.se/wallpaper/codecraftsman3.jpg',
    },
    {
      src: 'https://codecraftsman.se/wallpaper/codecraftsman4t.jpg',
      alt: 'Wallpaper 4',
      link: 'https://codecraftsman.se/wallpaper/codecraftsman4.jpg',
    },
    {
      src: 'https://codecraftsman.se/wallpaper/codecraftsman5t.jpg',
      alt: 'Wallpaper 5',
      link: 'https://codecraftsman.se/wallpaper/codecraftsman5.jpg',
    },
    {
      src: 'https://codecraftsman.se/wallpaper/codecraftsman6t.png',
      alt: 'Wallpaper 6',
      link: 'https://codecraftsman.se/wallpaper/codecraftsman6.png',
    },
    {
        src: 'https://codecraftsman.se/wallpaper/codecraftsman7t.jpg',
        alt: 'Wallpaper 7',
        link: 'https://codecraftsman.se/wallpaper/codecraftsman7.jpg',
      },
      {
        src: 'https://codecraftsman.se/wallpaper/codecraftsman8t.jpg',
        alt: 'Wallpaper 6',
        link: 'https://codecraftsman.se/wallpaper/codecraftsman8.jpg',
      },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (

    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
      <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-black p-6 rounded-lg shadow-lg mb-8">
        <AdsSection placement="middle" />
      </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">Gallery</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-4 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg">
          {images.map((image, index) => (
            <div key={index} className="relative group" onClick={() => openModal(image)}>
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover rounded-lg mb-4 border-4 border-cyan-500 shadow-xl"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-cyan-300 font-semibold text-lg">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative">
              <img
                src={selectedImage.link}
                alt={selectedImage.alt}
                className="max-w-full max-h-screen rounded-xl shadow-lg"
              />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 bg-cyan-500 text-black font-bold py-1 px-3 rounded-full hover:bg-cyan-400 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  
  );
};

export default GalleryPage;

