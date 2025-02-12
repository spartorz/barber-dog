import React, { useState, useEffect } from 'react';
import { apiService } from '../../../shared/services/apiService';
import ProductDetailModal from '../components/ProductDetailModal';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'shampoo', name: 'Shampoos' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'food', name: 'Pet Food' }
  ];

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const filteredProducts = products
    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="products-container">
      {/* Header Section */}
      <div className="products-header">
        <h1>Pet Care Products</h1>
        <p>Quality products for your beloved pets</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="product-image">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                loading="lazy"
              />
              {product.isNew && <span className="new-badge">New</span>}
              {product.discount > 0 && (
                <span className="discount-badge">{product.discount}% OFF</span>
              )}
            </div>
            <div className="product-content">
              <h2>{product.name}</h2>
              <p className="description">{product.description}</p>
              <div className="product-details">
                <div className="price-section">
                  {product.discount > 0 ? (
                    <>
                      <span className="original-price">${product.price}</span>
                      <span className="discounted-price">
                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="price">${product.price}</span>
                  )}
                </div>
                <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <button 
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shopping Cart Preview */}
      {cart.length > 0 && (
        <div className="cart-preview">
          <div className="cart-header">
            <h3>Shopping Cart ({cart.length})</h3>
          </div>
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.imageUrl} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <span>${item.price}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="checkout-btn">
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, quantity) => {
            addToCart({ ...product, quantity });
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Products; 