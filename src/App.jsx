import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import Layout from './Components/Layout';
import Home from './Pages/Home';
import Menu from './Pages/Menu';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Checkout from './Pages/Checkout';
import CreateItem from './Pages/CreateItem';


function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <Routes>
        <Route element={<Layout user={user} setUser={setUser} />}>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/menu" element={<Menu cart={cart} setCart={setCart} user={user} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/checkout" element={
            <Checkout
              cart={cart}
              setCart={setCart}
              user={user}
            />} />
          <Route path="/create-item" element={<CreateItem />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;
