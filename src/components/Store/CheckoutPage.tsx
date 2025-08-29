import React, { useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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

type LocationState = { cart?: CartItem[] };

const formatCurrency = (value: number, currency = "EUR") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);

const Field = (
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string }
) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-gray-300 mb-1">
      {props.label}
    </label>
    <input
      {...props}
      className={`w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 ring-1 ring-white/10 ${props.className || ""}`}
    />
  </div>
);

const Area = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; id: string }
) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-gray-300 mb-1">
      {props.label}
    </label>
    <textarea
      {...props}
      className={`w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 ring-1 ring-white/10 ${props.className || ""}`}
    />
  </div>
);

const ShippingOption: React.FC<{
  value: "standard" | "express";
  selected: string;
  onChange: (v: "standard" | "express") => void;
  title: string;
  subtitle: string;
  price: number;
}> = ({ value, selected, onChange, title, subtitle, price }) => (
  <button
    type="button"
    onClick={() => onChange(value)}
    className={`w-full text-left rounded-xl p-4 ring-1 transition-colors ${
      selected === value ? "bg-slate-800 ring-cyan-400/40" : "bg-slate-900 ring-white/10 hover:ring-white/20"
    }`}
    aria-pressed={selected === value}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      <p className="text-cyan-400 font-semibold">{formatCurrency(price)}</p>
    </div>
  </button>
);

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: LocationState };
  const cartItems: CartItem[] = useMemo(() => state?.cart ?? [], [state?.cart]);

  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const shippingCost = shipping === "express" ? 5.99 : 4.0;

  const subtotal = useMemo(
    () =>
      cartItems.reduce((total, item) => {
        const priceNum = parseFloat(item.price.replace(",", ".").replace("€", "").trim());
        return total + priceNum * item.quantity;
      }, 0),
    [cartItems]
  );
  const grandTotal = subtotal + (cartItems.length > 0 ? shippingCost : 0);

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-10 w-screen">
      <div className="mb-6 sm:mb-8 overflow-visible">
        {/* Header – exakt som Contact */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-[1.15] pb-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent mb-8">
          Checkout
        </h1>

        {/* Grid – samma proportioner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vänster kort: formulär + PayPal */}
          <div className="lg:col-span-2 rounded-1xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-6 sm:p-8 ring-1 ring-white/10 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Billing & Shipping Details
              </h2>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="name" label="Full name" type="text" required placeholder="Jane Doe" />
                  <Field id="email" label="Email" type="email" required placeholder="jane@example.com" />
                </div>

                <Field id="phone" label="Phone (optional)" type="tel" placeholder="+46 70 123 45 67" />

                <Area id="address" label="Address" rows={3} required placeholder="Street, number, apartment" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field id="zip" label="ZIP" type="text" required placeholder="123 45" />
                  <Field id="city" label="City" type="text" required placeholder="Stockholm" />
                  <Field id="country" label="Country" type="text" required placeholder="Sweden" />
                </div>

                {/* Shipping */}
                <div className="space-y-2 mt-2">
                  <label className="block text-sm font-medium text-gray-300">Shipping</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ShippingOption
                      value="standard"
                      selected={shipping}
                      onChange={setShipping}
                      title="Standard"
                      subtitle="3–5 business days"
                      price={4.0}
                    />
                    <ShippingOption
                      value="express"
                      selected={shipping}
                      onChange={setShipping}
                      title="Express"
                      subtitle="1–2 business days"
                      price={5.99}
                    />
                  </div>
                </div>

                {/* PayPal inuti samma kort */}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pay with PayPal</label>
                  <div className="p-4 bg-white rounded-xl shadow-md" style={{ minHeight: 60 }}>
                    <PayPalButtons
                      style={{
                        layout: "horizontal",
                        color: "black",
                        shape: "pill",
                        label: "pay",
                        height: 45,
                        tagline: false,
                      }}
                      forceReRender={[grandTotal, shipping]}
                      createOrder={(_data, actions) => {
                        if (!actions.order) {
                          return Promise.reject(new Error("PayPal SDK not ready"));
                        }
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: grandTotal.toFixed(2),
                                currency_code: "EUR",
                              },
                              description: "Order from CodeCraftsMan Store",
                            },
                          ],
                          intent: "CAPTURE",
                        });
                      }}
                      onApprove={async (_data, actions) => {
                        if (!actions.order) return;
                        await actions.order.capture();
                        alert("Thank you! Your payment was successful.");
                        navigate("/");
                      }}
                      onCancel={() => alert("Payment was cancelled.")}
                      onError={(err) => {
                        console.error("PayPal Error:", err);
                        alert("An error occurred with PayPal.");
                      }}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Höger kort: order-sammanfattning */}
          <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-6 ring-1 ring-white/10 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Your Items
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-gray-300">
                  <p>Your cart is empty.</p>
                  <Link
                    to="/store"
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30"
                  >
                    Back to Store
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => {
                    const unit = parseFloat(item.price.replace(",", ".").replace("€", "").trim());
                    const line = unit * item.quantity;
                    return (
                      <div key={index} className="flex gap-4 rounded-xl bg-slate-800/60 ring-1 ring-white/10 p-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md ring-1 ring-white/10"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="flex-1">
                          <p className="text-white font-semibold leading-tight">{item.name}</p>
                          <div className="text-xs text-gray-400 mt-0.5 space-x-2">
                            <span>Qty: {item.quantity}</span>
                            {item.size && <span>• Size: {item.size}</span>}
                            {item.color && <span>• Color: {item.color}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-300 text-xs">{item.price}</p>
                          <p className="text-cyan-400 font-semibold">{formatCurrency(line)}</p>
                        </div>
                      </div>
                    );
                  })}

                  <div className="border-t border-white/10 pt-4 space-y-1 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping</span>
                      <span>{formatCurrency(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-white text-lg font-bold mt-1">
                      <span>Total</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* (valfritt) Ett nederkort – om du vill spegla Contact ytterligare */}
        {/* <div className="mt-6 rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-6 ring-1 ring-white/10 shadow-2xl text-center">
            ... valfritt innehåll ...
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CheckoutPage;

