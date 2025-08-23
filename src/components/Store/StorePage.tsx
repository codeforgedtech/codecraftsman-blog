import React, { useState } from "react";
import AdsSection from "../Ads/adsPage";
import { useNavigate } from "react-router-dom";
import { FaOpencart, FaTrash } from "react-icons/fa6";

interface Product {
  id: number;
  name: string;
  price: string; // e.g. "2,49 €"
  image: string;
  description: string;
  category: string;
  sizes?: string[];
  color?: string[];
  colorImages?: { [key: string]: string };
  stock?: number;           // max available (sets or pieces)
  unitLabel?: string;       // label for quantity unit, e.g. "set (4 coasters)" or "pcs"
  unitMultiplier?: number;  // how many items per unit (for display)
}

interface CartItem extends Product {
  size?: string;
  selectedColor?: string;
  quantity: number; // number of units
}

const StorePage: React.FC = () => {
  // 🔒 Toggle this to enable/disable purchasing site-wide
  const COMING_SOON = true;

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [quantity, setQuantity] = useState<number>(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const addToCart = () => {
    if (COMING_SOON) return; // hard block
    if (!selectedProduct) return;

    const stockLimit = selectedProduct.stock ?? Infinity;

    const totalInCartForThisProduct = cartItems
      .filter((item) => item.id === selectedProduct.id)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (totalInCartForThisProduct + quantity > stockLimit) {
      alert(
        `Only ${stockLimit} ${selectedProduct.unitLabel ?? "pcs"} in stock for ${selectedProduct.name}.`
      );
      return;
    }

    const newItem: CartItem = {
      ...selectedProduct,
      size: selectedSize || undefined,
      selectedColor: selectedColor || undefined,
      quantity,
    };

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.selectedColor === newItem.selectedColor
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        const nextQty = updated[existingIndex].quantity + quantity;
        const stockLimit = selectedProduct.stock ?? Infinity;
        if (nextQty > stockLimit) {
          alert(
            `Only ${stockLimit} ${selectedProduct.unitLabel ?? "pcs"} in stock for ${selectedProduct.name}.`
          );
          return prev;
        }
        updated[existingIndex].quantity = nextQty;
        return updated;
      }

      return [...prev, newItem];
    });

    closeModal();
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const priceNum = parseFloat(item.price.replace(",", ".").replace("€", "").trim());
    return total + priceNum * item.quantity;
  }, 0);

  // Products with stock & unit info
  const products: Product[] = [
    {
      id: 1,
      name: "Drink Coaster Set (4-pack)",
      price: "5,49 €",
      image: "https://codecraftsman.se/store/coster.jpg",
      description:
        "High-quality CodeCraftsMan drink coasters – 1 set contains 4 coasters. Only 2 sets available in stock.",
      category: "Accessories",
      stock: 2,
      unitLabel: "set (4 coasters)",
      unitMultiplier: 4,
    },
    {
      id: 2,
      name: "Cap opener",
      price: "2,00 €",
      image: "https://codecraftsman.se/store/kaspyl.jpg",
      description:
        "High-quality CodeCraftsMan Cap opener. Only 3 items available in stock.",
      category: "Accessories",
      stock: 3,
      unitLabel: "pcs",
      unitMultiplier: 1,
    },
  ];

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setSelectedSize(null);
    setSelectedColor(null);
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
    setSelectedSize(null);
    setSelectedColor(null);
  };

  // Generate 1..stock options
  const quantityOptions = (p: Product | null) => {
    const max = p?.stock ?? 1;
    return Array.from({ length: max }, (_, i) => i + 1);
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <div className="p-1 rounded-lg shadow-lg mb-4">
          <AdsSection placement="in-content" />
        </div>

        {/* Coming soon banner */}
        {COMING_SOON && (
          <div className="mb-4 rounded-lg border border-yellow-400/30 bg-yellow-500/10 text-yellow-200 px-4 py-3">
            <p className="font-semibold">Store is coming soon</p>
            <p className="text-sm text-yellow-200/90">
              This page is a preview. Purchasing is temporarily disabled while we finish setup.
            </p>
          </div>
        )}

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-cyan-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={COMING_SOON}
            title={COMING_SOON ? "Cart preview only (coming soon)" : "Open cart"}
          >
            <FaOpencart size={20} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">Store</h1>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="relative bg-gray-800 rounded-lg p-4 shadow-md transition"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full aspect-square object-cover rounded-lg ${COMING_SOON ? "opacity-60" : ""}`}
                />
                {COMING_SOON && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-yellow-500/20 border border-yellow-400/30 text-yellow-200">
                      Coming soon
                    </span>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="mt-2 text-center">
                <h2 className="text-lg font-semibold text-gray-300">{product.name}</h2>
                <p className="text-cyan-500 font-bold">{product.price}</p>
              </div>

              {/* Click catcher for modal (disabled when coming soon) */}
              {!COMING_SOON ? (
                <button
                  onClick={() => openModal(product)}
                  className="mt-3 w-full bg-cyan-600 hover:bg-cyan-500 text-black font-semibold py-2 rounded-lg"
                >
                  View Details
                </button>
              ) : (
                <button
                  disabled
                  className="mt-3 w-full bg-gray-700 text-gray-300 font-semibold py-2 rounded-lg cursor-not-allowed"
                  title="Purchasing disabled (coming soon)"
                >
                  View Details
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Product Modal */}
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
                <div className="flex justify-center items-center bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="max-h-96 w-full object-contain opacity-90"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-cyan-400 mb-4">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-gray-300 mb-4">{selectedProduct.description}</p>
                    <p className="text-sm text-gray-400 mb-2">
                      Stock: {selectedProduct.stock} {selectedProduct.unitLabel ?? "pcs"}
                    </p>
                    <p className="text-2xl font-semibold text-cyan-500 mb-6">
                      {selectedProduct.price}
                    </p>
                    {COMING_SOON && (
                      <div className="mb-4 rounded-md border border-yellow-400/30 bg-yellow-500/10 text-yellow-200 px-3 py-2 text-sm">
                        Purchasing will be enabled when the store launches.
                      </div>
                    )}
                  </div>

                  {/* Quantity selector – dynamic per product */}
                  <div className="mb-6">
                    <label className="block text-gray-300 text-lg mb-2">
                      {selectedProduct.unitLabel
                        ? `Select quantity (${selectedProduct.unitLabel})`
                        : "Select quantity"}
                    </label>
                    <select
                      className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded-lg disabled:opacity-60"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      disabled={COMING_SOON}
                    >
                      {quantityOptions(selectedProduct).map((n) => (
                        <option key={n} value={n}>
                          {n} {selectedProduct.unitLabel ?? "pcs"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={closeModal}
                      className="flex-grow bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    >
                      Close
                    </button>
                    <button
                      onClick={addToCart}
                      disabled={COMING_SOON}
                      className="flex-grow bg-green-500 text-white px-4 py-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      title={COMING_SOON ? "Purchasing disabled (coming soon)" : "Add to Cart"}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Modal */}
        {isCartOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
            <div className="bg-gray-900 w-full max-w-2xl p-6 rounded-lg shadow-lg relative">
              <button
                onClick={() => setIsCartOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white "
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Your Cart</h2>

              {cartItems.length === 0 ? (
                <p className="text-gray-300">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-gray-700 pb-3"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border border-gray-700"
                        />
                        <div>
                          <p className="font-semibold text-gray-200">{item.name}</p>
                          <p className="text-sm text-gray-400">
                            {item.quantity} {item.unitLabel ?? "pcs"}
                            {item.unitMultiplier && item.unitMultiplier > 1
                              ? ` – ${item.quantity * (item.unitMultiplier ?? 1)} coasters`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-cyan-500 font-bold">{item.price}</p>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="mt-2 text-red-400 hover:text-red-600 transition"
                          title="Remove"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="text-right mt-6">
                    <p className="text-xl text-cyan-400 font-bold">
                      Total: {totalPrice.toFixed(2)} €
                    </p>
                    <button
                      onClick={() =>
                        navigate("/checkout", { state: { cart: cartItems } })
                      }
                      disabled={COMING_SOON}
                      className="mt-4 bg-green-500 text-black font-semibold px-4 py-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      title={COMING_SOON ? "Checkout disabled (coming soon)" : "Proceed to checkout"}
                    >
                      Go to Checkout
                    </button>
                    {COMING_SOON && (
                      <p className="mt-2 text-xs text-gray-400">
                        Checkout will be available when the store launches.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;




