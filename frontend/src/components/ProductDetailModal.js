import React, { useState } from 'react';
import './ProductDetailModal.css';

const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  const calculatePrice = () => {
    const basePrice = product.price;
    if (product.discount > 0) {
      return (basePrice * (1 - product.discount / 100)).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="product-detail-grid">
          {/* Product Images Section */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
              />
              {product.discount > 0 && (
                <span className="discount-tag">-{product.discount}%</span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((img, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} view ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="product-info">
            <h2>{product.name}</h2>
            <div className="price-container">
              {product.discount > 0 ? (
                <>
                  <span className="original-price">${product.price}</span>
                  <span className="final-price">${calculatePrice()}</span>
                </>
              ) : (
                <span className="final-price">${product.price}</span>
              )}
            </div>

            <div className="stock-info">
              <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.inStock && (
                <span className="stock-quantity">
                  {product.stockQuantity} units available
                </span>
              )}
            </div>

            <div className="description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {product.features && (
              <div className="features">
                <h3>Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.inStock && (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockQuantity}
                  >
                    +
                  </button>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => onAddToCart(product, quantity)}
                >
                  Add to Cart - ${(calculatePrice() * quantity).toFixed(2)}
                </button>
              </div>
            )}

            {/* Additional Info */}
            <div className="additional-info">
              {product.specifications && (
                <div className="specifications">
                  <h3>Specifications</h3>
                  <table>
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal; 