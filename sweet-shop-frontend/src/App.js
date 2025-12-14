import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Edit, Trash2, Package } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

export default function SweetShopApp() {
  const [user, setUser] = useState(null);
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [showAuthForm, setShowAuthForm] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [sweetForm, setSweetForm] = useState({ name: '', category: '', price: '', quantity: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setShowAuthForm(false);
      fetchSweets(userData.token);
    }
  }, []);

  useEffect(() => {
    filterSweets();
  }, [sweets, searchTerm, categoryFilter, minPrice, maxPrice]);

  const filterSweets = () => {
    let filtered = [...sweets];
    
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(s => 
        s.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }
    
    if (minPrice) {
      filtered = filtered.filter(s => parseFloat(s.price) >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      filtered = filtered.filter(s => parseFloat(s.price) <= parseFloat(maxPrice));
    }
    
    setFilteredSweets(filtered);
  };

  const handleAuth = async () => {
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      
      if (!res.ok) throw new Error('Authentication failed');
      
      const data = await res.json();
      const userData = { username: data.username, token: data.token };
      sessionStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setShowAuthForm(false);
      fetchSweets(data.token);
      setMessage(`Welcome, ${data.username}!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Authentication failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const fetchSweets = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/sweets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSweets(data);
    } catch (err) {
      setMessage('Failed to load sweets');
    }
  };

  const handleAddSweet = async () => {
    try {
      const res = await fetch(`${API_BASE}/sweets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...sweetForm,
          price: parseFloat(sweetForm.price),
          quantity: parseInt(sweetForm.quantity)
        })
      });
      
      if (!res.ok) throw new Error('Failed to add sweet');
      
      fetchSweets(user.token);
      setShowAddForm(false);
      setSweetForm({ name: '', category: '', price: '', quantity: '' });
      setMessage('Sweet added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to add sweet');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUpdateSweet = async () => {
    try {
      const res = await fetch(`${API_BASE}/sweets/${editingSweet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: sweetForm.name || undefined,
          category: sweetForm.category || undefined,
          price: sweetForm.price ? parseFloat(sweetForm.price) : undefined,
          quantity: sweetForm.quantity ? parseInt(sweetForm.quantity) : undefined
        })
      });
      
      if (!res.ok) throw new Error('Failed to update sweet');
      
      fetchSweets(user.token);
      setEditingSweet(null);
      setSweetForm({ name: '', category: '', price: '', quantity: '' });
      setMessage('Sweet updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update sweet');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteSweet = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/sweets/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      
      if (!res.ok) throw new Error('Failed to delete sweet');
      
      fetchSweets(user.token);
      setMessage('Sweet deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to delete sweet. Admin access required.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handlePurchase = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/sweets/${id}/purchase`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      
      if (!res.ok) throw new Error('Purchase failed');
      
      fetchSweets(user.token);
      setMessage('Purchase successful!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Purchase failed. Item may be out of stock.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRestock = async (id) => {
    const quantity = prompt('Enter restock quantity:');
    if (!quantity || isNaN(quantity)) return;
    
    try {
      const res = await fetch(`${API_BASE}/sweets/${id}/restock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ quantity: parseInt(quantity) })
      });
      
      if (!res.ok) throw new Error('Restock failed');
      
      fetchSweets(user.token);
      setMessage('Restock successful!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Restock failed. Admin access required.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    setSweets([]);
    setShowAuthForm(true);
    setMessage('Logged out successfully');
    setTimeout(() => setMessage(''), 3000);
  };

  const startEdit = (sweet) => {
    setEditingSweet(sweet);
    setSweetForm({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString()
    });
  };

  if (showAuthForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2 text-purple-600">🍬 Sweet Shop</h1>
          <p className="text-center text-gray-600 mb-6">Your favorite candy store</p>
          
          {message && (
            <div className="bg-blue-100 text-blue-700 p-3 rounded-lg mb-4 text-center">
              {message}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              />
            </div>
            <button
              onClick={handleAuth}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {isRegister ? 'Register' : 'Login'}
            </button>
          </div>
          
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="w-full mt-4 text-purple-600 hover:underline"
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">🍬 Sweet Shop</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user.username}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {message && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center">
            {message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 w-32"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 w-32"
            />
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            <Plus size={20} /> Add New Sweet
          </button>
        </div>

        {(showAddForm || editingSweet) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-purple-600">
              {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={sweetForm.name}
                onChange={(e) => setSweetForm({ ...sweetForm, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Category"
                value={sweetForm.category}
                onChange={(e) => setSweetForm({ ...sweetForm, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={sweetForm.price}
                onChange={(e) => setSweetForm({ ...sweetForm, price: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={sweetForm.quantity}
                onChange={(e) => setSweetForm({ ...sweetForm, quantity: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <div className="col-span-2 flex gap-2">
                <button
                  onClick={editingSweet ? handleUpdateSweet : handleAddSweet}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  {editingSweet ? 'Update' : 'Add'} Sweet
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingSweet(null);
                    setSweetForm({ name: '', category: '', price: '', quantity: '' });
                  }}
                  className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSweets.map((sweet) => (
            <div key={sweet.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="bg-gradient-to-br from-pink-200 to-purple-200 p-6 text-center">
                <div className="text-5xl mb-2">🍭</div>
                <h3 className="text-xl font-bold text-purple-800">{sweet.name}</h3>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                    {sweet.category}
                  </span>
                  <span className="text-2xl font-bold text-purple-600">${sweet.price}</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Stock: <span className={sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                    {sweet.quantity} units
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePurchase(sweet.id)}
                    disabled={sweet.quantity === 0}
                    className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                      sweet.quantity > 0
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={18} /> Purchase
                  </button>
                  <button
                    onClick={() => startEdit(sweet)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleRestock(sweet.id)}
                    className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                    title="Restock (Admin)"
                  >
                    <Package size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteSweet(sweet.id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    title="Delete (Admin)"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSweets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No sweets found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}