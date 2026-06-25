import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product 1', price: 500, quantity: 2 },
    { id: 2, name: 'Product 2', price: 750, quantity: 1 },
    { id: 3, name: 'Product 3', price: 1000, quantity: 1 },
  ]);

  // Update product quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeProduct(id);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  // Remove product from cart
  const removeProduct = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const shipping = cartItems.length > 0 ? 50 : 0;
  const cartTotal = subtotal + tax + shipping;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
            <Link 
              to="/" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">Product</th>
                      <th className="px-6 py-4 text-left font-bold">Price</th>
                      <th className="px-6 py-4 text-left font-bold">Quantity</th>
                      <th className="px-6 py-4 text-left font-bold">Total</th>
                      <th className="px-6 py-4 text-left font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mr-3">
                              📦
                            </div>
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-blue-600 font-semibold">${item.price}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-12 text-center border rounded px-2 py-1"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold">${item.price * item.quantity}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => removeProduct(item.id)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Continue Shopping Link */}
              <div className="mt-6">
                <Link 
                  to="/" 
                  className="text-blue-600 hover:underline font-medium"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Cart Summary Section */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
                <h2 className="text-2xl font-bold mb-6">Cart Summary</h2>
                
                <div className="space-y-4 mb-6 pb-4 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal ({cartItems.length} items)</span>
                    <span className="font-semibold">${subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tax (10%)</span>
                    <span className="font-semibold">${tax}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Shipping</span>
                    <span className="font-semibold">${shipping}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold">Cart Total</span>
                  <span className="text-2xl font-bold text-blue-600">${cartTotal}</span>
                </div>

                <Link
                  to="/Checkout"
                  className="w-full block bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 text-center font-bold mb-3 transition"
                >
                  Proceed to Checkout
                </Link>

                <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-medium transition">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ShoppingCart;
