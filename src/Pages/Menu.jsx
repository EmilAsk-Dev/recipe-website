import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, Info, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Menu = ({ cart, setCart, user }) => {
  const [animatingId, setAnimatingId] = useState(null);
  const [justAddedId, setJustAddedId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const favoritesRef = useRef(null);
  const sidesRef = useRef(null);
  const huvudrattRef = useRef(null);
  const efterrattRef = useRef(null);
  const dryckRef = useRef(null);


  const API_BASE_URL = 'http://localhost:5000';

  //hård codade kategorier
  const categories = [
    { id: 'sides', name: 'Sides', emoji: '🍟', ref: sidesRef },
    { id: 'huvudratt', name: 'Huvudrätt', emoji: '🍛', ref: huvudrattRef },
    { id: 'efterratt', name: 'Efterrätt', emoji: '🍰', ref: efterrattRef },
    { id: 'dryck', name: 'Dryck', emoji: '🥤', ref: dryckRef }
  ];

  const scrollToSection = (ref) => {
    if (ref.current) {
      const top = ref.current.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  //hämtar menyobjekt från JSON server
  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`);
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);

    }
  };
  //hämtar användarens favoriter från JSON server
  const fetchUserFavorites = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`);
      const userData = await response.json();
      setUserFavorites(userData.favorites || []);
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      setUserFavorites([]);
    }
  };

  // toggle favoriter
  const toggleFavorite = async (itemId) => {
    if (!user?.id) {
      alert('Du måste vara inloggad för att spara favoriter');
      return;
    }

    const isFavorite = userFavorites.includes(itemId);
    const updatedFavorites = isFavorite
      ? userFavorites.filter(id => id !== itemId)
      : [...userFavorites, itemId];

    try {
      await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favorites: updatedFavorites
        })
      });
      setUserFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchMenuItems(), fetchUserFavorites()])
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }, [user]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    setJustAddedId(item.id);
    setAnimatingId(item.id);

    setTimeout(() => {
      setJustAddedId(null);
      setAnimatingId(null);
    }, 500);
  };

  const GoToCheckout = () => {
    if (cart.length === 0) {
      alert('Din varukorg är tom. Lägg till produkter innan du går till kassan.');
      return;
    }

    navigate('/checkout', {
      state: {
        cart,
        total: getTotalPrice(),
      },
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });

    setAnimatingId(id);
    setTimeout(() => setAnimatingId(null), 300);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Filtrerar menyobjekt baserat på kategori och sökterm
  const getItemsByCategory = (category) => {
    return menuItems.filter(item =>
      item.category === category &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getPopularItems = () => {
    return menuItems.filter(item =>
      item.popular &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6);
  };

  const getFavoriteItems = () => {
    return menuItems.filter(item =>
      userFavorites.includes(item.id) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const MenuItem = ({ item, showInfo = false }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm text-gray-500 flex-shrink-0">{item.id}.</span>
            <h3 className="font-medium text-gray-900 break-words">{item.name}</h3>
            {item.popular && (
              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded whitespace-nowrap">
                🔥 Populärt
              </span>
            )}
            {showInfo && <Info size={16} className="text-gray-400 flex-shrink-0" />}
          </div>
          <p className="text-sm text-gray-600 mb-2">från {item.price} kr</p>
          <p className="text-xs text-gray-500 break-words">{item.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {user && (
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${userFavorites.includes(item.id)
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
                }`}
            >
              <Heart size={16} fill={userFavorites.includes(item.id) ? 'currentColor' : 'none'} />
            </button>
          )}
          <button
            onClick={() => addToCart(item)}
            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-pink-500 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar meny...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 text-white py-8 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="lg:w-1/2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
                {user ? (
                  <>
                    Välkommen tillbaka, <span className="text-yellow-200">{user.username}</span>!
                  </>
                ) : (
                  <>
                    God mat
                    <span className="block text-yellow-200">Till dörren</span>
                  </>
                )}
              </h1>

              <p className="text-lg lg:text-xl mb-8 text-orange-100">
                {user
                  ? 'Utforska vår meny och njut av dina favoriter igen!'
                  : 'Utforska vår meny och njut av de bästa smakerna hemma'}
              </p>



            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative max-w-sm lg:max-w-md">
                <div className="w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
                  <span className="text-white text-6xl lg:text-8xl">🍔</span>
                </div>
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-orange-800 rounded-full px-4 py-2 font-bold text-sm shadow-lg">
                  helt ok
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 pt-0 pr-4 pb-4 pl-4 lg:pt-0 lg:pr-6 lg:pb-6 lg:pl-6">
          {/* Sticky Search Bar and Navigation */}
          <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 mb-8 -mx-4 lg:-mx-6 px-4 lg:px-6 py-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Sök i menyn"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Delivery Options - Mobile Only */}
            <div className="lg:hidden mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Leverans</span>
                <span className="font-medium">Pick-Up</span>
              </div>
              <p className="text-sm text-gray-600">Standard • 45 - 60 min</p>
            </div>

            {/* Category Navigation */}
            <div className="flex gap-2 lg:gap-4 overflow-x-auto scrollbar-hide">
              {user && getFavoriteItems().length > 0 && (
                <button
                  onClick={() => scrollToSection(favoritesRef)}
                  className="pb-3 px-3 lg:px-4 text-gray-600 hover:text-gray-900 whitespace-nowrap flex-shrink-0 text-sm lg:text-base border-b-2 border-transparent hover:border-gray-300 transition-colors"
                >
                  ❤️ Favoriter ({getFavoriteItems().length})
                </button>
              )}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToSection(category.ref)}
                  className="pb-3 px-3 lg:px-4 text-gray-600 hover:text-gray-900 whitespace-nowrap flex-shrink-0 text-sm lg:text-base border-b-2 border-transparent hover:border-gray-300 transition-colors"
                >
                  {category.emoji} {category.name} ({getItemsByCategory(category.id).length})
                </button>
              ))}
            </div>
          </div>

          {/* Menu Content */}
          <div className="space-y-12">
            {/* Favorites Section */}
            {user && getFavoriteItems().length > 0 && (
              <section ref={favoritesRef}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">❤️</span>
                  <h2 className="text-xl font-semibold text-gray-900">Dina Favoriter</h2>
                </div>
                <p className="text-gray-600 mb-4">Dina sparade favoriter</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {getFavoriteItems().map(item => (
                    <MenuItem key={item.id} item={item} showInfo />
                  ))}
                </div>
              </section>
            )}

            {/* Dynamic Category Sections */}
            {categories.map((category) => {
              const categoryItems = getItemsByCategory(category.id);
              if (categoryItems.length === 0 && !searchTerm) return null;

              return (
                <section key={category.id} ref={category.ref}>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">{category.emoji}</span>
                    <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                  </div>
                  {categoryItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {categoryItems.map(item => (
                        <MenuItem key={item.id} item={item} showInfo />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        {searchTerm
                          ? `Inga ${category.name.toLowerCase()} matchar din sökning`
                          : `Inga ${category.name.toLowerCase()} tillgängliga just nu`
                        }
                      </p>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 p-6 sticky top-0 z-50 h-fit" style={{ height: '100vh', overflowY: 'auto' }}>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Leverans</span>
              <span className="font-medium">Pick-Up</span>
            </div>
            <p className="text-sm text-gray-600">Standard • 45 - 60 min</p>
          </div>

          <h3 className="font-semibold mb-4">Dina valda produkter</h3>

          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 bg-red-50 rounded-lg ${animatingId === item.id ? 'animate-pop' : ''}`}
              >
                <div className="w-8 h-8 bg-pink-200 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium">{item.quantity}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.price} kr</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Popular or Favorite Items */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{user ? 'Favoriter' : 'Populärt'}</h4>
            <p className="text-sm text-gray-600 mb-3">
              {user ? 'Dina sparade favoriter' : 'Baserat på andras köp'}
            </p>
            <div className="space-y-2">
              {(user ? getFavoriteItems() : getPopularItems()).slice(0, 3).map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => addToCart(item)}
                >
                  <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">{item.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-600">{item.price} kr</p>
                  </div>
                  <Plus size={16} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>


          {/* Order Summary */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Delsumma</span>
              <span>{getTotalPrice()} kr</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Avgift för mindre beställning</span>
              <span>5 kr</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Serviceavgift</span>
              <span>8 kr</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total (ink moms och avgifter)</span>
              <span>{getTotalPrice() + 13} kr</span>
            </div>
            <p className="text-xs text-gray-500">Se prisuppdelning</p>
          </div>

          <button onClick={GoToCheckout} className="w-full mt-6 bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors">
            Granska Order
          </button>
        </div>

        {/* Mobile Cart Button - Only shown on mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
          <button className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center justify-between">
            <span>Visa varukorg ({cart.length})</span>
            <span>{getTotalPrice() + 13} kr</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .animate-pop {
          animation: pop 300ms ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Menu;