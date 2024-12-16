import React, { useState } from 'react';
import AdsSection from '../Ads/adsPage';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
}

const StorePage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products: Product[] = [
    {
      id: 1,
      name: 'Full Colour Mug',
      price: '17.99 €',
      image: 'https://codecraftsman.se/store/cup.png',
      description: 'The black Mug with the logo for CodeCraftsMan!',
    },
    {
      id: 2,
      name: 'Sticker',
      price: '2.99 €',
      image: 'https://codecraftsman.se/store/stickers.png',
      description: 'Sticker with the log för CodeCraftsMan!',
    },
    {
        id: 3,
        name: 'Contrasting Mug',
        price: '17.49 €',
        image: 'https://codecraftsman.se/store/cup2.png',
        description: 'A Multicolor Mug with the logo for CodeCraftsMan',
      },
    // Add more products as needed
  ];

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <div className="p-1 rounded-lg shadow-lg mb-4">
          <AdsSection placement="in-content" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">Store</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative group cursor-pointer"
              onClick={() => openModal(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-lg font-bold">
                View Details
              </div>
              <div className="mt-2 text-center">
                <h2 className="text-lg font-semibold text-gray-300">{product.name}</h2>
                <p className="text-cyan-500 font-bold">{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-3xl w-full h-auto max-h-[90vh] overflow-auto">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-auto mb-4 rounded-lg max-h-96 object-contain"
              />
              <h2 className="text-2xl font-bold text-cyan-500 mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-300 mb-4">{selectedProduct.description}</p>
              <p className="text-lg font-bold text-cyan-500 mb-4">{selectedProduct.price}</p>
              <button
                onClick={closeModal}
                className="bg-cyan-500 text-white px-4 py-2 rounded-full hover:bg-cyan-400 mb-2"
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-400"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;
