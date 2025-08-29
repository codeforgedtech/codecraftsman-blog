import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaTrash ,FaShoppingBasket} from "react-icons/fa";

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
  stock?: number; // max available (sets or pieces)
  unitLabel?: string; // label for quantity unit, e.g. "set (4 coasters)" or "pcs"
  unitMultiplier?: number; // how many items per unit (for display)
}

interface CartItem extends Product {
  size?: string;
  selectedColor?: string;
  quantity: number; // number of units
}

const Badge: React.FC<{ children: React.ReactNode; tone?: "info" | "warning" | "neutral" }> = ({
  children,
  tone = "neutral",
}) => {
  const tones = {
    info: "bg-cyan-500/10 text-cyan-300 ring-cyan-400/20",
    warning: "bg-yellow-500/10 text-yellow-200 ring-yellow-400/30",
    neutral: "bg-white/10 text-gray-200 ring-white/20",
  } as const;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
};



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
      alert(`Only ${stockLimit} ${selectedProduct.unitLabel ?? "pcs"} in stock for ${selectedProduct.name}.`);
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
          item.id === newItem.id && item.size === newItem.size && item.selectedColor === newItem.selectedColor
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        const nextQty = updated[existingIndex].quantity + quantity;
        if (nextQty > stockLimit) {
          alert(`Only ${stockLimit} ${selectedProduct.unitLabel ?? "pcs"} in stock for ${selectedProduct.name}.`);
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
      description: "High-quality CodeCraftsMan Cap opener. Only 3 items available in stock.",
      category: "Accessories",
      stock: 3,
      unitLabel: "pcs",
      unitMultiplier: 1,
    },
     {
      id: 3,
      name: "Cap opener",
      price: "2,00 €",
      image: "https://codecraftsman.se/store/kaspyl.jpg",
      description: "High-quality CodeCraftsMan Cap opener. Only 3 items available in stock.",
      category: "Accessories",
      stock: 3,
      unitLabel: "pcs",
      unitMultiplier: 1,
    },
      {
      id: 4,
      name: "Cap opener",
      price: "2,00 €",
      image: "https://codecraftsman.se/store/kaspyl.jpg",
      description: "High-quality CodeCraftsMan Cap opener. Only 3 items available in stock.",
      category: "Accessories",
      stock: 3,
      unitLabel: "pcs",
      unitMultiplier: 1,
    },
  ];

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  const filteredProducts = selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory);

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
    <div className="bg-black min-h-screen text-white font-sans px-2 sm:px-4 lg:px-6 py-8 w-full overflow-x-hidden">
      <div className="w-full">
        {/* Header + Cart */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="self-start text-left text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-[1.15] pb-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            Store
          </h1>

          <button
  onClick={() => setIsCartOpen(true)}
  className="relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30 disabled:opacity-60 disabled:cursor-not-allowed self-center sm:self-auto sm:ml-auto"
  disabled={COMING_SOON}
  title={COMING_SOON ? "Cart preview only (coming soon)" : "Open cart"}
  aria-label="Open cart"
>
  
 <div className="text-white">
  <FaShoppingBasket size={20} />
</div>
  {cartItems.length > 0 && (
    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-1 ring-white/20">
      {cartItems.length}
    </span>
  )}
</button>
        </div>

        {/* Coming soon banner */}
        {COMING_SOON && (
          <div className="mb-6 rounded-2xl p-[1px] bg-gradient-to-br from-yellow-400/40 via-white/10 to-transparent">
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black px-4 py-3 ring-1 ring-white/10">
              <div className="flex items-start gap-3">
                <Badge tone="warning">Coming soon</Badge>
                <div className="text-sm text-yellow-200/90">
                  <p className="font-semibold">Store is coming soon</p>
                  <p>This page is a preview. Purchasing is temporarily disabled while we finish setup.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label htmlFor="category-filter" className="text-sm text-gray-300">
            Filter by category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2.5 bg-slate-900 text-white border border-white/10 rounded-lg text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Product grid: auto-fit för snygg responsivitet */}
      <div
  className="grid gap-6"
  style={{
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", // täcker hela skärmen
  }}
>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent"
            >
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-black p-4 shadow-2xl h-full">
                {/* Image */}
                <div className="relative overflow-hidden rounded-[0.70rem] ring-1 ring-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.28),0_0_48px_rgba(34,211,238,0.18)]">
                  <div className="w-full aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${
                        COMING_SOON ? "opacity-80" : ""
                      }`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {COMING_SOON && (
                    <div className="absolute top-3 left-3">
                      <Badge tone="warning">Coming soon</Badge>
                    </div>
                  )}
                </div>

                {/* Title & price */}
                <h2 className="mt-4 text-lg font-bold text-white line-clamp-2">{product.name}</h2>
                <p className="mt-1 text-cyan-400 font-semibold">{product.price}</p>

                {/* CTA */}
                {!COMING_SOON ? (
                  <button
                    onClick={() => openModal(product)}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30"
                  >
                    View Details
                  </button>
                ) : (
                  <button
                    disabled
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-slate-800 text-white/70 ring-1 ring-white/10 cursor-not-allowed"
                    title="Purchasing disabled (coming soon)"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Product Modal */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
            <div className="w-full max-w-4xl rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-black p-5 sm:p-6 ring-1 ring-white/10 shadow-2xl text-white">
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                  aria-label="Close"
                >
                  ✕
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="overflow-hidden rounded-xl ring-1 ring-white/10 bg-slate-800/60 flex items-center justify-center">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="max-h-96 w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        {selectedProduct.name}
                      </h2>
                      <p className="mt-3 text-gray-300">{selectedProduct.description}</p>
                      <p className="mt-2 text-sm text-gray-400">
                        Stock: {selectedProduct.stock} {selectedProduct.unitLabel ?? "pcs"}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-cyan-400">{selectedProduct.price}</p>
                      {COMING_SOON && (
                        <div className="mt-3">
                          <Badge tone="warning">Purchasing disabled until launch</Badge>
                        </div>
                      )}
                    </div>

                    {/* Quantity selector – dynamic per product */}
                    <div className="mt-6">
                      <label className="block text-gray-300 text-sm mb-1">
                        {selectedProduct.unitLabel
                          ? `Select quantity (${selectedProduct.unitLabel})`
                          : "Select quantity"}
                      </label>
                      <select
                        className="w-full p-2.5 bg-slate-800 text-white rounded-lg ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-60"
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

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 ring-1 ring-white/10"
                      >
                        Close
                      </button>
                      <button
                        onClick={addToCart}
                        disabled={COMING_SOON}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        title={COMING_SOON ? "Purchasing disabled (coming soon)" : "Add to Cart"}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Modal */}
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4">
            <div className="w-full max-w-2xl rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-black p-5 ring-1 ring-white/10 shadow-2xl text-white">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                  aria-label="Close cart"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Your Cart
                </h2>

                {cartItems.length === 0 ? (
                  <p className="text-gray-300">Your cart is empty.</p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-xl bg-slate-800/60 ring-1 ring-white/10 p-3"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md ring-1 ring-white/10"
                          />
                          <div>
                            <p className="font-semibold text-white">{item.name}</p>
                            <p className="text-xs text-gray-400">
                              {item.quantity} {item.unitLabel ?? "pcs"}
                              {item.unitMultiplier && item.unitMultiplier > 1
                                ? ` – ${item.quantity * (item.unitMultiplier ?? 1)} coasters`
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-cyan-400 font-semibold">{item.price}</p>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="mt-2 inline-flex items-center gap-1 text-red-400 hover:text-red-300"
                            title="Remove"
                          >
                            <FaTrash />
                            <span className="sr-only">Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="text-right mt-6">
                      <p className="text-xl font-bold text-cyan-400">Total: {totalPrice.toFixed(2)} €</p>
                      <button
                        onClick={() => navigate("/checkout", { state: { cart: cartItems } })}
                        disabled={COMING_SOON}
                        className="mt-3 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        title={COMING_SOON ? "Checkout disabled (coming soon)" : "Proceed to checkout"}
                      >
                        Go to Checkout
                      </button>
                      {COMING_SOON && (
                        <p className="mt-2 text-xs text-gray-400">Checkout will be available when the store launches.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;






