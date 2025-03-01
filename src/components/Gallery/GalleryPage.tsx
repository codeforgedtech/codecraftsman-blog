import React, { useState } from "react";
import AdsSection from "../Ads/adsPage";

interface Image {
  link: string;
  alt: string;
  src: string;
}

const GalleryPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images: Image[] = [
    {
      src: "https://codecraftsman.se/wallpaper/codecraftsman1t.jpg",
      alt: "Wallpaper 1",
      link: "https://codecraftsman.se/wallpaper/codecraftsman1.jpg",
    },
    {
      src: "https://codecraftsman.se/wallpaper/codecraftsman2t.jpg",
      alt: "Wallpaper 2",
      link: "https://codecraftsman.se/wallpaper/codecraftsman2.jpg",
    },
    {
      src: "https://codecraftsman.se/wallpaper/codecraftsman3t.jpg",
      alt: "Wallpaper 3",
      link: "https://codecraftsman.se/wallpaper/codecraftsman3.jpg",
    },
    {
      src: "https://codecraftsman.se/wallpaper/codecraftsman4t.jpg",
      alt: "Wallpaper 4",
      link: "https://codecraftsman.se/wallpaper/codecraftsman4.jpg",
    },
    {
      src: "https://codecraftsman.se/wallpaper/codecraftsman5t.jpg",
      alt: "Wallpaper 5",
      link: "https://codecraftsman.se/wallpaper/codecraftsman5.jpg",
    },
    {
      src: "https://codecraftsman.se/wallpaper/codecraftsman6t.png",
      alt: "Wallpaper 6",
      link: "https://codecraftsman.se/wallpaper/codecraftsman6.png",
    },
    {
      src: "https://codecraftsman.se/wallpaper/codecraftsman7t.jpg",
      alt: "Wallpaper 7",
      link: "https://codecraftsman.se/wallpaper/codecraftsman7.jpg",
    },
    {
      src: "https://codecraftsman.se/wallpaper/codecraftsman8t.jpg",
      alt: "Wallpaper 8",
      link: "https://codecraftsman.se/wallpaper/codecraftsman8.jpg",
    },
    {
      src: "https://codecraftsman.se/wallpaper/codecraftsman9t.jpg",
      alt: "Wallpaper 9",
      link: "https://codecraftsman.se/wallpaper/codecraftsman9.jpg",
    },
    {
      src: "https://codecraftsman.se/wallpaper/codecraftsman10t.jpg",
      alt: "Wallpaper 10",
      link: "https://codecraftsman.se/wallpaper/codecraftsman10.jpg",
    },
    {
      src: "https://codecraftsman.se/wallpaper/codecraftsman11t.jpg",
      alt: "Wallpaper 11",
      link: "https://codecraftsman.se/wallpaper/codecraftsman11.jpg",
    },
    {
      src: "https://codecraftsman.se/wallpaper/codecraftsman12t.jpg",
      alt: "Wallpaper 12",
      link: "https://codecraftsman.se/wallpaper/codecraftsman12.jpg",
    },
  ];

  const openModal = (image: Image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <div className="p-2 rounded-lg shadow-lg mb-4">
          <AdsSection placement="in-content" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-500 mb-6 text-center">
          Gallery
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2 bg-gray-900 rounded-xl shadow-lg">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => openModal(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-32 sm:h-48 object-cover rounded-lg transition-transform transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-lg font-bold">
                View
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-3xl w-full max-h-screen overflow-auto">
            <img
              src={selectedImage.link}
              alt={selectedImage.alt}
              className="w-full max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <p className="text-gray-300 mt-2 mb-4">{selectedImage.alt}</p>
            <button
              onClick={closeModal}
              className="bg-cyan-500 text-white px-6 py-2 rounded-full hover:bg-cyan-400 w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
