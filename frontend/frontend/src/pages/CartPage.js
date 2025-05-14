import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import Message from '../components/layout/Message';
import { toast } from 'react-toastify';
import { clearShoppingDataForAdmin } from '../utils/adminUtils';

// Helper function to create a URL slug (consider moving to a utils file)
const createSlug = (name) => {
  if (!name) return 'product';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // Redirect admins out of the shopping cart
  useEffect(() => {
    if (userInfo?.isAdmin) {
      clearShoppingDataForAdmin();
      toast.error('Admin users cannot access the shopping cart');
      navigate('/admin/dashboard');
    }
  }, [userInfo, navigate]);

  // Totals
  const itemsCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal   = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  const shipping   = subtotal > 100 ? 0 : 10;
  const total      = subtotal + shipping;

  // Handlers
  const updateQtyHandler = (item, qty) => {
    if (qty < 1) return;
    dispatch(addToCart({ ...item, qty }));
  };
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <>
      <Link to="/" className="flex items-center text-primary mb-4 hover:underline">
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty.{' '}
            <Link to="/" className="text-primary hover:underline">Go Back</Link>
          </Message>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img className="h-16 w-16 object-cover" src={item.image} alt={item.name} />
                              {/* Update the Link 'to' prop */}
                              <Link
                                to={`/product/${item._id}/${createSlug(item.name)}`}
                                className="ml-4 text-sm font-medium text-gray-900 hover:text-primary"
                              >
                                {item.name}
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            GH₵{item.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center border rounded-md w-32">
                              <button
                                onClick={() => updateQtyHandler(item, item.qty - 1)}
                                disabled={item.qty <= 1}
                                className="px-3 py-1 hover:bg-gray-100"
                              >
                                <FaMinus className="h-3 w-3" />
                              </button>
                              <span className="px-3">{item.qty}</span>
                              <button
                                onClick={() => updateQtyHandler(item, item.qty + 1)}
                                className="px-3 py-1 hover:bg-gray-100"
                              >
                                <FaPlus className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            GH₵{(item.qty * item.price).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <button onClick={() => removeFromCartHandler(item._id)} className="text-red-500 hover:text-red-700">
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({itemsCount}):</span>
                    <span className="font-medium">GH₵{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">{shipping === 0 ? 'Free' : `GH₵${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg text-primary">GH₵{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={checkoutHandler}
                  disabled={cartItems.length === 0}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
