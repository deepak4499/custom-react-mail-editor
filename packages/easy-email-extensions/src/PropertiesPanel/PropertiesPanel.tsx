import React, { useState } from 'react';
import { Page } from '../AttributePanel/components/blocks/Page';
import { MultiAutocomplete } from './MultiSelect';

export function PropertiesPanel({ formDataSet }) {
  const [formData, setFormData] = useState({
    ...formDataSet
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  function handleMailChange(name, value) {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.template_name) newErrors.template_name = 'Template Name is required';
    if (!formData.from_address_id) newErrors.email = 'Email is required';
    if (formData.cc_mail_ids.length === 0) newErrors.cc = 'Cc Email is required';
    if (formData.bcc_mail_ids.length === 0) newErrors.bcc = 'Bcc Email is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log('Form submitted:', formData);
      // Add your form submission logic here
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ borderTop: '1px solid #e5e6eb', padding: 10 }}>
      <div className="form-group">
        <label>
          Template Name
        </label>
        <input
          type="text"
          name="template_name"
          value={formData.template_name}
          onChange={handleChange}
          className="form-control"
        />
        {errors.template_name && <span>{errors.template_name}</span>}
      </div>
      <div className="form-group">
        <label>
          From
        </label>
        <MultiAutocomplete isMulti={false} selectedEmailList={formData.from_address_id} handleChange={handleMailChange} name="from_address_id" />
        {/* <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
        /> */}
        {errors.email && <span>{errors.email}</span>}
      </div>
      <div className="form-group">
        <label>
          Cc
        </label>
        <MultiAutocomplete isMulti={true} selectedEmailList={formData.cc_mail_ids} handleChange={handleMailChange} name="cc_mail_ids" />
        {/* <input
          type="email"
          name="cc"
          value={formData.cc}
          onChange={handleChange}
          className="form-control"
        /> */}
        {errors.cc && <span>{errors.cc}</span>}
      </div>
      <div className="form-group">
        <label>
          Bcc
          <MultiAutocomplete isMulti={true} selectedEmailList={formData.bcc_mail_ids} handleChange={handleMailChange} name="bcc_mail_ids" />
          {/* <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-control"
          /> */}
        </label>
        {errors.bcc && <span>{errors.bcc}</span>}
      </div>
      <Page />
      <button type="submit">Submit</button>
    </form>
  );
};
