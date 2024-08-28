import React, { useState, useEffect } from 'react';
import AddRetailerForm from './AddRetailerForm';

const AddProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subcategories, setSubcategories] = useState('');
  const [photos, setPhotos] = useState('');
  const [retailerId, setRetailerId] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [currency, setCurrency] = useState('');
  const [priceDate, setPriceDate] = useState('');
  const [retailers, setRetailers] = useState([]);
  const [selectedRetailers, setSelectedRetailers] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    fetchRetailers();
  }, []);

  const fetchRetailers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/retailers');
      const data = await response.json();
      setRetailers(data);
    } catch (error) {
      console.error('Error fetching retailers:', error);
    }
  };

  const handleAddOrEditRetailer = () => {
    const selectedRetailer = retailers.find((r) => r._id === retailerId);
    if (selectedRetailer) {
      const retailerData = {
        ...selectedRetailer,
        price,
        link,
        currency,
        priceDate,
      };

      if (editIndex === -1) {
        setSelectedRetailers([...selectedRetailers, retailerData]);
      } else {
        const updatedRetailers = selectedRetailers.map((retailer, index) =>
          index === editIndex ? retailerData : retailer
        );
        setSelectedRetailers(updatedRetailers);
        setEditIndex(-1);
      }

      setRetailerId('');
      setPrice('');
      setLink('');
      setCurrency('');
      setPriceDate('');
    }
  };

  const handleEditRetailer = (index) => {
    const retailer = selectedRetailers[index];
    setRetailerId(retailer._id);
    setPrice(retailer.price);
    setLink(retailer.link);
    setCurrency(retailer.currency);
    setPriceDate(retailer.priceDate);
    setEditIndex(index);
  };

  const handleRemoveRetailer = (index) => {
    const updatedRetailers = selectedRetailers.filter((_, i) => i !== index);
    setSelectedRetailers(updatedRetailers);
  };

  const handleRetailerAdded = (newRetailer) => {
    setRetailers([...retailers, newRetailer]); // Add new retailer to the list
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name,
      description,
      category,
      subcategories: subcategories.split(',').map((sub) => sub.trim()),
      photos: photos.split(',').map((photo) => photo.trim()),
      prices: selectedRetailers.map((retailer) => ({
        retailerId: retailer._id,
        price: parseFloat(retailer.price),
        link: retailer.link,
        currency: retailer.currency,
        priceDate: retailer.priceDate,
      })),
    };

    try {
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('Product added successfully');
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="product-form">
        <h2>Add Product</h2>
        <div className="form-row">
          <div className="form-group half-width">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group half-width">
            <label>Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Subcategories (comma-separated):</label>
          <input
            type="text"
            value={subcategories}
            onChange={(e) => setSubcategories(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Photos (comma-separated URLs):</label>
          <input
            type="text"
            value={photos}
            onChange={(e) => setPhotos(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label>Retailer:</label>
            <select
              value={retailerId}
              onChange={(e) => setRetailerId(e.target.value)}
            >
              <option value="">Select a Retailer</option>
              {retailers.map((retailer) => (
                <option key={retailer._id} value={retailer._id}>
                  {retailer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group half-width">
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label>Link:</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className="form-group half-width">
            <label>Currency:</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Price Date:</label>
          <input
            type="date"
            value={priceDate}
            onChange={(e) => setPriceDate(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="add-retailer-button"
          onClick={handleAddOrEditRetailer}
        >
          {editIndex === -1 ? 'Add Retailer' : 'Update Retailer'}
        </button>

        <h3>Selected Retailers</h3>
        <ul>
          {selectedRetailers.map((retailer, index) => (
            <li key={index}>
              {retailer.name} - {retailer.price} {retailer.currency} (
              {retailer.link})
              <button type="button" onClick={() => handleEditRetailer(index)}>
                Edit
              </button>
              <button type="button" onClick={() => handleRemoveRetailer(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>

        <button type="submit">Add Product</button>
      </form>

      {/* Add Retailer Form */}
      <br />
      <AddRetailerForm onRetailerAdded={handleRetailerAdded} />
    </div>
  );
};

export default AddProductForm;
