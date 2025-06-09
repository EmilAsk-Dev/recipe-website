import { useState } from 'react';
import { Trash2, CreditCard, Smartphone, ArrowLeft, Check } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function CheckoutPaymentPage({ cart, setCart }) {
  // Simulate cart data

  const [currentStep, setCurrentStep] = useState('checkout'); // 'checkout', 'confirmation'
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState("");

  useEffect(() => {
    if (currentStep === 'confirmation') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [currentStep]);

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    city: '',
    address: '',
    houseNumber: ''
  });
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [swishNumber, setSwishNumber] = useState('');

  const validDiscountCodes = {
    "WELCOME10": 10,
    "SPECIAL25": 25,
    "FAMILY15": 15
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * (appliedDiscount / 100);
  const finalTotal = subtotal - discountAmount;

  // Fixed fees in kr
  const smallOrderFee = 5;
  const serviceFee = 8;
  const totalWithFees = finalTotal + smallOrderFee + serviceFee;

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, change) => {
    setCart(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(item.quantity + change, 1) }
          : item
      )
    );
  };

  const applyDiscount = () => {
    const code = discountCode.toUpperCase().trim();
    const discount = validDiscountCodes[code];

    if (discount) {
      setAppliedDiscount(discount);
      setDiscountMessage(`${discount}% rabatt tillagd!`);
    } else {
      setAppliedDiscount(0);
      setDiscountMessage("Ogiltig rabattkod");
    }
  };

  const proceedToPayment = () => {
    if (cart.length === 0) return;
    // Remove this function since we're keeping everything on one page
  };

  const isDeliveryInfoValid = () => {
    return deliveryInfo.name && deliveryInfo.city && deliveryInfo.address && deliveryInfo.houseNumber;
  };

  const isPaymentInfoValid = () => {
    if (paymentMethod === 'card') {
      return cardInfo.number && cardInfo.expiry && cardInfo.cvv && cardInfo.name;
    } else if (paymentMethod === 'swish') {
      return swishNumber.length >= 10;
    }
    return false;
  };

  const placeOrder = () => {
    if (!isDeliveryInfoValid() || !isPaymentInfoValid()) {
      alert('Vänligen fyll i all information');
      return;
    }
    setCurrentStep('confirmation');
  };

  const backToMenu = () => {
    setCurrentStep('checkout');
    setCart([
      { id: 1, name: "Margherita Pizza", price: 120, quantity: 2 },
      { id: 2, name: "Caesar Salad", price: 85, quantity: 1 },
      { id: 3, name: "Coca Cola", price: 25, quantity: 3 }
    ]);
    setAppliedDiscount(0);
    setDiscountMessage("");
    setDeliveryInfo({ name: '', city: '', address: '', houseNumber: '' });
    setCardInfo({ number: '', expiry: '', cvv: '', name: '' });
    setSwishNumber('');
  };

  if (currentStep === 'confirmation') {
    return (
      <div className="flex flex-col min-h-screen p-4 max-w-xl mx-auto justify-center items-center bg-green-50">
        <div className="text-center space-y-4">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800">Beställning Bekräftad!</h2>
          <p className="text-gray-700">Tack för din beställning!</p>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="font-semibold">Totalt: {totalWithFees.toFixed(2)} kr</p>
            <p className="text-sm text-gray-600">Levereras till: {deliveryInfo.address} {deliveryInfo.houseNumber}, {deliveryInfo.city}</p>
            <p className="text-sm text-gray-600">Betalningsmetod: {paymentMethod === 'card' ? 'Kontokort' : 'Swish'}</p>
          </div>
          <button
            onClick={backToMenu}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Tillbaka till Meny
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Kassa & Betalning</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Din varukorg är tom.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Cart and Order Summary */}
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Din Beställning</h3>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-b-0">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.price.toFixed(2)} kr x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-1 border rounded hover:bg-gray-100 transition"
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-1 border rounded hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 transition">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount Code */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">Rabattkod</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Rabattkod"
                  value={discountCode}
                  onChange={e => setDiscountCode(e.target.value)}
                  className="flex-grow border p-2 rounded"
                />
                <button
                  onClick={applyDiscount}
                  className="bg-pink-600 text-white px-4 rounded hover:bg-pink-700 transition"
                >
                  Använd
                </button>
              </div>
              {discountMessage && <p className="mt-2 text-sm text-gray-700">{discountMessage}</p>}
            </div>

            {/* Price Summary */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">Prissammanfattning</h3>
              <div className="space-y-2 text-sm text-gray-800">
                <div className="flex justify-between">
                  <span>Delsumma</span>
                  <span>{subtotal.toFixed(2)} kr</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Rabatt ({appliedDiscount}%)</span>
                    <span>-{discountAmount.toFixed(2)} kr</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Avgift för mindre beställning</span>
                  <span>{smallOrderFee} kr</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Serviceavgift</span>
                  <span>{serviceFee} kr</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total (inkl moms och avgifter)</span>
                  <span>{totalWithFees.toFixed(2)} kr</span>
                </div>
                <p className="text-xs text-gray-500">Se prisuppdelning</p>
              </div>
            </div>
          </div>

          {/* Right Column - Delivery and Payment */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">📍 Leveransinformation</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Namn"
                  value={deliveryInfo.name}
                  onChange={e => setDeliveryInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border p-3 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Stad"
                  value={deliveryInfo.city}
                  onChange={e => setDeliveryInfo(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full border p-3 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Gatuadress"
                  value={deliveryInfo.address}
                  onChange={e => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full border p-3 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Husnummer"
                  value={deliveryInfo.houseNumber}
                  onChange={e => setDeliveryInfo(prev => ({ ...prev, houseNumber: e.target.value }))}
                  className="w-full border p-3 rounded-lg"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">💳 Betalningsalternativ</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={e => setPaymentMethod(e.target.value)}
                  />
                  <CreditCard size={20} />
                  <span>Kontokort</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="swish"
                    checked={paymentMethod === 'swish'}
                    onChange={e => setPaymentMethod(e.target.value)}
                  />
                  <Smartphone size={20} />
                  <span>Swish</span>
                </label>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Betalningsuppgifter</h3>
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Kortinnehavarens namn"
                    value={cardInfo.name}
                    onChange={e => setCardInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border p-3 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Kortnummer (1234 5678 9012 3456)"
                    value={cardInfo.number}
                    onChange={e => setCardInfo(prev => ({ ...prev, number: e.target.value }))}
                    className="w-full border p-3 rounded-lg"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="MM/ÅÅ"
                      value={cardInfo.expiry}
                      onChange={e => setCardInfo(prev => ({ ...prev, expiry: e.target.value }))}
                      className="flex-1 border p-3 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cardInfo.cvv}
                      onChange={e => setCardInfo(prev => ({ ...prev, cvv: e.target.value }))}
                      className="flex-1 border p-3 rounded-lg"
                    />
                  </div>
                </div>
              )}
              {paymentMethod === 'swish' && (
                <input
                  type="text"
                  placeholder="Telefonnummer (070-123 45 67)"
                  value={swishNumber}
                  onChange={e => setSwishNumber(e.target.value)}
                  className="w-full border p-3 rounded-lg"
                />
              )}
            </div>

            <button
              onClick={placeOrder}
              disabled={!isDeliveryInfoValid() || !isPaymentInfoValid()}
              className="w-full bg-pink-600 text-white py-4 rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
            >
              Bekräfta Beställning - {totalWithFees.toFixed(2)} kr
            </button>
          </div>
        </div>
      )}
    </div>
  );
}