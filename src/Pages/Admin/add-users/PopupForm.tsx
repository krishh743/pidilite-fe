import React, { useState, useEffect } from 'react';

const PopupForm = ({ onClose, onSubmit }) => {
  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    uniqueId: generateUniqueId(),
    type: '2',
    status: '1'
  });

  useEffect(() => {
    setFormData({
      ...formData,
      uniqueId: generateUniqueId(),
      type: '2',
      status: '1'
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="popupForm">
      <div className="popupFormContent">
        <span className="closeBtn" onClick={onClose}>&times;</span>
        <h2>Add User</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Phone Number:</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />

          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <label>Unique ID:</label>
          <input type="text" name="uniqueId" value={formData.uniqueId} onChange={handleChange} readOnly required />

          <label>Type:</label>
          <select name="type" value={formData.type} onChange={handleChange} required>
            <option value="1">Type 1</option>
            <option value="2">Type 2</option>
          </select>

          <label>Status:</label>
          <input type="number" name="status" value={formData.status} onChange={handleChange} readOnly required />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
