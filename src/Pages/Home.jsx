import { useState, useEffect } from 'react';
import { ChevronRight, Star, Heart, ShoppingBag, Menu, X, ArrowRight, MapPin, Clock, Truck } from 'lucide-react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

export default function FoodOrderingHomepage({ user = null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Popular');
  const [popularDishes, setPopularDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/menu?popular=true')
      .then(response => {
        setPopularDishes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching menu:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const scrollElements = document.querySelectorAll('[data-scroll]');
      scrollElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('scroll-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredDishes = [];
  const filteredDishes = activeCategory === 'Popular' ? featuredDishes : featuredDishes.filter(dish => dish.category === activeCategory);

  const testimonials = [
    { id: 1, name: 'Emma Johnson', text: 'Maten kom varm och fräsch. Helt utsökt!', rating: 5 },
    { id: 2, name: 'Michael Chen', text: 'Bästa upplevelsen jag haft med att beställa online. Kommer definitivt beställa igen.', rating: 5 },
    { id: 3, name: 'Sarah Williams', text: 'Stort utbud och fantastisk kvalitet. Rekommenderas starkt!', rating: 4 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
          }
          to { 
            opacity: 1; 
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px); 
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounceGentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(2deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(251, 146, 60, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(251, 146, 60, 0.8);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 1s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 1s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
        
        .animate-bounce-gentle {
          animation: bounceGentle 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounceSlow 4s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        

        
        [data-scroll] {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .scroll-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #f97316, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.9);
        }
      `}</style>



      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-white pt-20 px-4 md:hidden transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col space-y-6 text-center">
          <a href="#" className="font-medium text-gray-800 hover:text-orange-600 transition-colors text-xl py-2">Hem</a>
          <a href="menu" className="font-medium text-gray-800 hover:text-orange-600 transition-colors text-xl py-2">Menu</a>
          <Link to="/menu" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300 mx-auto">
            Beställ Nu
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden">

        {/* Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-200/30 rounded-full blur-2xl animate-float"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <span className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium animate-scale-in">
                  Logga in för att spara dina favorit rätter
                </span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight ">
                  <span className="block animate-fade-in-up">God mat</span>
                  <span className="block gradient-text animate-fade-in-up delay-200">
                    Snabb leverans
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed animate-fade-in-up delay-400">
                  Vi erbjuder en enkel och snabb lösning för att beställa din favoritmat online. Välj från hundratals menyer och få maten levererad direkt till din dörr.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-600">
                <Link to={"menu"} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center group hover:scale-105 hover:shadow-xl animate-glow">
                  Beställ Nu
                  <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" size={24} />
                </Link>
                {user === null && (
                  <button className="glass-effect hover:bg-gray-50 text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    Logga In
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-6 pt-4 animate-fade-in-up delay-800">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(item => (
                    <div
                      key={item}
                      className="w-12 h-12 rounded-full border-3 border-white bg-gray-200 overflow-hidden hover:scale-110 transition-transform duration-300 animate-scale-in"
                      style={{ animationDelay: `${0.8 + item * 0.1}s` }}
                    >
                      <img
                        src={`https://images.unsplash.com/photo-150700321${item + 6}-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face`}
                        alt="Customer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="animate-slide-in-right delay-1000">
                  <div className="flex items-center mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={20} fill="#FBBF24" stroke="none" className="animate-scale-in" style={{ animationDelay: `${1 + star * 0.1}s` }} />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-800 font-bold text-lg">4.8</span>
                  </div>
                  <p className="text-gray-600">Från 2,000+ nöjda kunder</p>
                </div>
              </div>
            </div>

            <div className="relative animate-scale-in delay-300" data-scroll>
              <div className="relative">
                <div className="bg-white p-4 rounded-3xl shadow-2xl transform transition-all duration-700 hover:scale-105 hover:rotate-1 hover-lift">
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src="/Img/burger-5.png"
                      alt="Delicious Food"
                      className="w-full h-auto transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </div>


                <div className="absolute -bottom-8 -right-8 bg-gradient-to-r from-orange-600 to-pink-600 text-white p-6 rounded-2xl shadow-xl animate-bounce-slow">
                  <div className="text-2xl font-bold">30% OFF</div>
                  <div className="text-sm opacity-90">Första beställningen</div>
                </div>


                <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-400 rounded-full animate-bounce-gentle animate-float opacity-80"></div>
                <div className="absolute top-1/2 -right-4 w-8 h-8 bg-pink-400 rounded-full animate-bounce-gentle delay-500 animate-float opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

      </section>


      <section id="menu" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-16" data-scroll>
            <span className="text-orange-600 font-semibold text-lg animate-fade-in">Mest populära</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 animate-slide-up delay-200">Favorit Rätter</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in-up delay-400">
              Upptäck våra mest älskade rätter som håller högsta kvalitet och smak
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600"></div>
            </div>
          ) : (
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={20}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="popular-dishes-carousel"
            >
              {popularDishes.map((dish, index) => (
                <SwiperSlide key={dish.id}>
                  <div
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up hover-lift"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
                        <Heart size={18} className="text-gray-600 hover:text-red-500 transition-colors" />
                      </button>
                      <div className="absolute bottom-4 left-4 glass-effect px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex items-center space-x-1">
                          <Star size={14} fill="#FBBF24" stroke="none" />
                          <span className="text-sm font-semibold">{dish.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-orange-600 transition-colors duration-300">
                        {dish.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-orange-600">{dish.price}:-</span>
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105">
                          Lägg till
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" data-scroll>
            {[
              { number: '2000+', label: 'Nöjda Kunder' },
              { number: '500+', label: 'Rätter' },
              { number: '30min', label: 'Snabb Leverans' },
              { number: '4.8★', label: 'Genomsnittligt Betyg' }
            ].map((stat, index) => (
              <div key={index} className="animate-scale-in hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold mb-2 animate-pulse">{stat.number}</div>
                <div className="text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-16" data-scroll>
            <span className="text-orange-600 font-semibold text-lg animate-fade-in">Vad säger våra kunder</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 animate-slide-up delay-200">Recensioner</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-scroll>
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up hover-lift"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#FBBF24" stroke="none" className="animate-scale-in" style={{ animationDelay: `${index * 0.2 + i * 0.1}s` }} />
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="font-semibold text-gray-900 text-lg">
                  {testimonial.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="animate-fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-6">
                <span className="text-orange-600">Drone</span> Delight
              </h3>
              <p className="mb-6 leading-relaxed">Utsökt mat levererad direkt till din dörr med precision och kärlek.</p>
              <div className="flex space-x-4">
                {['🐦', '📘', '📷'].map((icon, index) => (
                  <a key={index} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-all duration-300 text-lg hover:scale-110 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="animate-fade-in-up delay-200">
              <h4 className="font-bold text-white mb-6 text-lg">Kontakt</h4>
              <ul className="space-y-3">
                <li className="flex items-center hover:text-orange-600 transition-colors">
                  <MapPin size={16} className="mr-3 text-orange-600" />
                  <span>Emilstorp</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-3 text-orange-600">📞</span>
                  <a href="tel:+46123123123" className="hover:text-orange-600 transition-colors">
                    +46 123 123 123
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="mr-3 text-orange-600">✉️</span>
                  <a href="mailto:info@dronedelight.com" className="hover:text-orange-600 transition-colors">
                    info@dronedelight.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="animate-fade-in-up delay-400">
              <h4 className="font-bold text-white mb-6 text-lg">Snabblänkar</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Hem</a></li>
                <li><a href="/menu" className="hover:text-orange-600 transition-colors">Meny</a></li>
              </ul>
            </div>

            <div className="animate-fade-in-up delay-600">
              <h4 className="font-bold text-white mb-6 text-lg">Öppettider</h4>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span>Måndag - Fredag</span>
                  <span>10:00 - 22:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Helger</span>
                  <span>11:00 - 21:00</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center animate-fade-in delay-800">
            <p>&copy; {new Date().getFullYear()} Drone Delight. Alla rättigheter förbehållna.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}