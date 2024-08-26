// AddProduct.jsx
import React, { useState, useEffect } from 'react';

function AddProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [prices, setPrices] = useState([{ retailerId: '', price: '', link: '' }]);
  const [retailers, setRetailers] = useState([]);

  useEffect(() => {
    async function fetchRetailers() {
      try {
        const response = await fetch('/api/retailers');
        if (!response.ok) {
          throw new Error('Failed to fetch retailers');
        }
        const data = await response.json();
        setRetailers(data);
      } catch (error) {
        console.error('Error fetching retailers:', error);
      }
    }
    fetchRetailers();
  }, []);  

  const handlePriceChange = (index, event) => {
    const { name, value } = event.target;
    const newPrices = [...prices];
    newPrices[index][name] = value;
    setPrices(newPrices);
  };

  const addPriceField = () => {
    setPrices([...prices, { retailerId: '', price: '', link: '' }]);
  };

  const removePriceField = (index) => {
    const newPrices = prices.filter((_, i) => i !== index);
    setPrices(newPrices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name,
      description,
      photos: [photo],
      prices,
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('Product added successfully');
        setName('');
        setDescription('');
        setPhoto('');
        setPrices([{ retailerId: '', price: '', link: '' }]);
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h2>Add Product</h2>
      <label>
        Product Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label>
        Photo URL:
        <input
          type="text"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          required
        />
      </label>
      <h3>Prices</h3>
      {prices.map((price, index) => (
        <div key={index} className="price-entry">
          <label>
            Retailer:
            <select
              name="retailerId"
              value={price.retailerId}
              onChange={(e) => handlePriceChange(index, e)}
              required
            >
              <option value="">Select Retailer</option>
              {retailers.map((retailer) => (
                <option key={retailer._id} value={retailer._id}>
                  {retailer.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={price.price}
              onChange={(e) => handlePriceChange(index, e)}
              required
            />
          </label>
          <label>
            Link:
            <input
              type="text"
              name="link"
              value={price.link}
              onChange={(e) => handlePriceChange(index, e)}
              required
            />
          </label>
          <button type="button" onClick={() => removePriceField(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addPriceField}>
        Add Another Price
      </button>
      <button type="submit">Add Product</button>
    </form>
  );
}

export default AddProduct;
