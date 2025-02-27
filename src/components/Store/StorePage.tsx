import React, { useState } from "react";
import AdsSection from "../Ads/adsPage";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  sizes?: string[];
  color?: string[];
  category: string;
  colorImages?: { [key: string]: string };
}

const StorePage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null); // State for color selection
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const products: Product[] = [
    {
      id: 1,
      name: "Full Colour Mug",
      price: "17.99 €",
      image: "https://codecraftsman.se/store/cup.png",
      description: "The black Mug with the logo for CodeCraftsMan!",
      category: "Mugs",
    },
    {
      id: 2,
      name: "Sticker",
      price: "2.99 €",
      image: "https://codecraftsman.se/store/stickers.png",
      description: "Sticker with the logo för CodeCraftsMan!",
      category: "Accessories",
    },
    {
      id: 3,
      name: "Contrasting Mug",
      price: "17.49 €",
      image: "https://codecraftsman.se/store/cup2.png",
      description: "A Multicolor Mug with the logo for CodeCraftsMan",
      category: "Mugs",
    },
    {
      id: 4,
      name: "Womens T-Shirt",
      price: "23.49 €",
      image: "https://codecraftsman.se/store/shirtW.png",
      description: "Womens T-Shirt with the logo for CodeCraftsMan",
      sizes: ["S", "M", "L", "XL"],
      category: "Clothing",
    },
    {
      id: 5,
      name: "Mens T-Shirt",
      price: "23.49 €",
      image: "https://codecraftsman.se/store/shirtM.png",
      description: "Mens T-Shirt with the logo for CodeCraftsMan",
      sizes: ["M", "L", "XL", "XXL"],
      category: "Clothing",
    },
    {
      id: 6,
      name: "Womens Premium Tank Top",
      price: "25.99 €",
      image: "https://codecraftsman.se/store/linneW.png",
      description: "Womens Premium Tank Top with the logo for CodeCraftsMan",
      sizes: ["S", "M", "L"],
      category: "Clothing",
    },
    {
      id: 7,
      name: "Mens Premium Hooded Jacket",
      price: "43.49 €",
      image: "https://codecraftsman.se/store/jacketM.png",
      description: "Mens Premium Hooded Jacket with the logo for CodeCraftsMan",
      sizes: ["M", "L", "XL"],
      category: "Clothing",
    },
    {
      id: 8,
      name: "Men’s Pool Sliders",
      price: "21,49 €",
      image: "https://codecraftsman.se/store/pool.jpg",
      description: "Men’s Pool Sliders whith the logo of CodeCraftsMan",
      sizes: ["41", "42", "43", "44"],
      category: "Shoes",
    },
    {
      id: 9, // Changed ID to 9 for uniqueness
      name: "Unisex Baseball Hoodie",
      price: "241,49 €",
      description: "Unisex Baseball Hoodie whith the logo of CodeCraftsMan",
      color: ["black/red", "heather grey/black", "graphite/black"],
      sizes: ["S", "M", "L", "XL"],
      category: "Clothing",
      colorImages: {
        "black/red": "https://codecraftsman.se/store/hoodie_black_red.jpg", // Image for black/red
        "heather grey/black":
          "https://codecraftsman.se/store/hoodie_heather_grey_black.jpg", // Image for heather grey/black
        "graphite/black":
          "https://codecraftsman.se/store/hoodie_graphite_black.jpg", // Image for graphite/black
      },
      image: "https://codecraftsman.se/store/dubbelMunk.jpg", // Default image
    },
  ];
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setSelectedSize(null); // Reset size selection when opening a new modal
    setSelectedColor(null); // Reset color selection when opening a new modal
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
    setSelectedSize(null);
    setSelectedColor(null); // Reset color when closing the modal
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (
      selectedProduct &&
      selectedProduct.colorImages &&
      selectedProduct.colorImages[color]
    ) {
      setSelectedProduct({
        ...selectedProduct,
        image: selectedProduct.colorImages[color], // Update the image based on selected color
      });
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <div className="p-1 rounded-lg shadow-lg mb-4">
          <AdsSection placement="in-content" />
        </div>
        <div className="bg-cyan-500 text-black text-center py-2 font-semibold text-lg mb-6">
          Open Soon! Stay Tuned for Exciting New Products.
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">
          Store
        </h1>

        <div className="mb-4">
          <label htmlFor="category-filter" className="block text-cyan-400 mb-2">
            Filter by Category:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 bg-gray-800 text-cyan-400 border border-gray-600 rounded"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg">
          {filteredProducts.map((product) => (
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
                <h2 className="text-lg font-semibold text-gray-300">
                  {product.name}
                </h2>
                <p className="text-cyan-500 font-bold">{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-2xl text-white max-w-4xl w-full h-auto max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 text-xl"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="flex justify-center items-center bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="max-h-96 w-full object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-between">
                  {/* Title and Description */}
                  <div>
                    <h2 className="text-3xl font-bold text-cyan-400 mb-4">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-gray-300 mb-6">
                      {selectedProduct.description}
                    </p>
                    <p className="text-2xl font-semibold text-cyan-500 mb-6">
                      {selectedProduct.price}
                    </p>
                  </div>

                  {/* Size Selector */}
                  {selectedProduct.sizes && (
                    <div className="mb-6">
                      <label className="block text-gray-300 text-lg mb-2">
                        Select Size:
                      </label>
                      <select
                        className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={selectedSize || ""}
                        onChange={(e) => setSelectedSize(e.target.value)}
                      >
                        <option value="" disabled>
                          Choose a size
                        </option>
                        {selectedProduct.sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Color Selector (if colors exist) */}
                  {selectedProduct.color && (
                    <div className="mb-6">
                      <label className="block text-gray-300 text-lg mb-2">
                        Select Color:
                      </label>
                      <select
                        className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={selectedColor || ""}
                        onChange={(e) => handleColorChange(e.target.value)}
                      >
                        <option value="" disabled>
                          Choose a color
                        </option>
                        {selectedProduct.color.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={closeModal}
                      className="flex-grow bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all"
                    >
                      Close
                    </button>
                    <button
                      className={`flex-grow ${
                        (selectedProduct.sizes && !selectedSize) ||
                        (selectedProduct.color && !selectedColor)
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-400"
                      } text-white px-4 py-2 rounded-lg transition-all`}
                      disabled={
                        (selectedProduct.sizes && !selectedSize) ||
                        (selectedProduct.color && !selectedColor)
                      }
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;
