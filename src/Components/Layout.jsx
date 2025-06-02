import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';

const Layout = ({ user, setUser }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // Paths where nav should be hidden
  const hideNavOnPaths = [];
  const showNav = !hideNavOnPaths.includes(location.pathname);

  // Calculate total items count
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart operations
  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsMenuOpen(false); // Stäng menyn efter logout
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Funktion för att stänga menyn när en länk klickas
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      {/* Conditionally render nav */}
      {showNav && (
        <>
          <nav className="fixed w-full z-50 transition-all duration-300 bg-white shadow-md py-2">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center" onClick={closeMenu}>
                  <h1 className="text-2xl font-bold text-orange-600">
                    Drone<span className="text-gray-800"> Delight</span>
                  </h1>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  <Link to="/" className="font-medium text-gray-800 hover:text-orange-600 transition-colors">
                    Hem
                  </Link>
                  <Link to="/menu" className="font-medium text-gray-800 hover:text-orange-600 transition-colors">
                    Meny
                  </Link>
                </div>

                {/* Right Side Buttons */}
                <div className="flex items-center space-x-4">
                  {/* Cart Button */}


                  {/* Desktop Buttons */}
                  <Link
                    to="/menu"
                    className="hidden md:flex bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300"
                  >
                    Beställ nu
                  </Link>

                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="hidden md:flex bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300"
                    >
                      Logga ut
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="hidden md:flex bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300"
                    >
                      Logga in
                    </Link>
                  )}

                  {/* Mobile Menu Button */}
                  <button
                    className="p-2 md:hidden text-gray-800 hover:text-orange-600 transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Menu - Full Screen Dropdown */}
          <div className={`fixed top-0 left-0 w-full bg-white shadow-lg transform transition-all duration-500 ease-in-out z-40 md:hidden overflow-hidden ${isMenuOpen
            ? 'translate-y-0 opacity-100 max-h-screen'
            : '-translate-y-full opacity-0 max-h-0'
            }`}>
            <div className="pt-20 pb-8 px-6">
              {/* Menu Items with staggered animations */}
              <div className="flex flex-col space-y-6">
                <Link
                  to="/"
                  className={`text-2xl font-semibold text-gray-800 hover:text-orange-600 transition-all duration-300 py-3 border-b border-gray-100 transform ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                    } hover:translate-x-2 hover:scale-105`}
                  style={{ transitionDelay: isMenuOpen ? '100ms' : '0ms' }}
                  onClick={closeMenu}
                >
                  Hem
                </Link>

                <Link
                  to="/menu"
                  className={`text-2xl font-semibold text-gray-800 hover:text-orange-600 transition-all duration-300 py-3 border-b border-gray-100 transform ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                    } hover:translate-x-2 hover:scale-105`}
                  style={{ transitionDelay: isMenuOpen ? '200ms' : '0ms' }}
                  onClick={closeMenu}
                >
                  Menu
                </Link>

                <Link
                  to="/menu"
                  className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 text-center shadow-lg transform ${isMenuOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
                    } hover:scale-110 hover:shadow-xl active:scale-95`}
                  style={{ transitionDelay: isMenuOpen ? '300ms' : '0ms' }}
                  onClick={closeMenu}
                >
                  Beställ nu
                </Link>

                {user ? (
                  <button
                    onClick={handleLogout}
                    className={`bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg transform ${isMenuOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
                      } hover:scale-110 hover:shadow-xl active:scale-95`}
                    style={{ transitionDelay: isMenuOpen ? '400ms' : '0ms' }}
                  >
                    Logga ut
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 text-center shadow-lg transform ${isMenuOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
                      } hover:scale-110 hover:shadow-xl active:scale-95`}
                    style={{ transitionDelay: isMenuOpen ? '400ms' : '0ms' }}
                    onClick={closeMenu}
                  >
                    🔐 Logga in
                  </Link>
                )}
              </div>

              {/* Decorative elements */}
              <div className={`mt-8 flex justify-center space-x-4 transform transition-all duration-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`} style={{ transitionDelay: isMenuOpen ? '500ms' : '0ms' }}>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Page content */}
      <div style={{ paddingTop: showNav ? '3rem' : 0 }}>
        <Outlet context={{ cart, addToCart, removeFromCart, itemCount }} />
      </div>
    </div>
  );
};

export default Layout;