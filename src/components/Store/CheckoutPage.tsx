import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems: CartItem[] = location.state?.cart || [];

  const [shipping, setShipping] = useState<"standard" | "express">("standard");

  const shippingCost = shipping === "express" ? 9.99 : 4.99;

  const totalPrice = cartItems.reduce((total, item) => {
    const priceNum = parseFloat(item.price.replace(",", ".").replace("€", ""));
    return total + priceNum * item.quantity;
  }, 0);

  const grandTotal = totalPrice + shippingCost;

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <div className="bg-cyan-500 text-black text-center py-2 font-semibold text-lg mb-6 rounded">
          Complete Your Purchase Securely
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Checkout Form + PayPal */}
          <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-xl shadow-lg space-y-6">
            {/* Name */}
            <div>
              <label className="block mb-1 text-cyan-300 font-semibold">Name</label>
              <input
                type="text"
                required
                className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block mb-1 text-cyan-300 font-semibold">Email</label>
              <input
                type="email"
                required
                className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
              />
            </div>
            {/* Address */}
            <div>
              <label className="block mb-1 text-cyan-300 font-semibold">Address</label>
              <textarea
                required
                className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
              />
            </div>
            {/* Shipping */}
            <div>
              <label className="block mb-2 text-cyan-300 font-semibold">Shipping</label>
              <select
                value={shipping}
                onChange={(e) => setShipping(e.target.value as "standard" | "express")}
                className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
              >
                <option value="standard">Standard (4.99 €)</option>
                <option value="express">Express (9.99 €)</option>
              </select>
            </div>

            {/* PayPal */}
            <div>
            <div className="space-y-2">
  <label className="block text-cyan-300 font-semibold">
    Pay with PayPal
  </label>

  <div
    className="p-4 bg-white rounded-lg shadow-md"
    style={{ minHeight: "60px" }} // säkerställer att iframe passar in snyggt
  >
    <PayPalButtons
      style={{
        layout: "horizontal",
        color: "black", // svart knapp, bäst i mörk miljö
        shape: "pill",
        label: "pay",
        height: 45,
        tagline: false,
      }}
      forceReRender={[grandTotal]}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: grandTotal.toFixed(2),
                currency_code: "USD",
              },
              description: "Order from CodeCraftsMan Store",
            },
          ],
        });
      }}
      onApprove={(data, actions) => {
        return actions.order!.capture().then(() => {
          alert("Thank you! Your payment was successful.");
          navigate("/");
        });
      }}
      onCancel={() => {
        alert("Payment was cancelled.");
      }}
      onError={(err) => {
        console.error("PayPal Error:", err);
        alert("An error occurred with PayPal.");
      }}
    />
  </div>
</div>
</div>
</div>

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-xl shadow-lg h-fit">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Your Items</h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-400">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4 bg-gray-800 p-4 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex flex-col justify-between w-full">
                      <div>
                        <p className="text-lg font-semibold">{item.name}</p>
                        {item.size && (
                          <p className="text-sm text-gray-400">Size: {item.size}</p>
                        )}
                        {item.color && (
                          <p className="text-sm text-gray-400">Color: {item.color}</p>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-400">x{item.quantity}</p>
                        <p className="text-cyan-400 font-bold">{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-700 pt-4 text-right space-y-2">
                  <p className="text-white">Subtotal: {totalPrice.toFixed(2)} €</p>
                  <p className="text-white">Shipping: {shippingCost.toFixed(2)} €</p>
                  <p className="text-xl text-cyan-400 font-bold">
                    Total: {grandTotal.toFixed(2)} €
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;


