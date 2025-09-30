import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { userService } from '@/services/api/userService';

const UserForm = ({ user, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name_c: '',
    email_c: '',
    phone_c: '',
    role_c: 'Sales Rep',
    status_c: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name_c: user.name_c || '',
        email_c: user.email_c || '',
        phone_c: user.phone_c || '',
        role_c: user.role_c || 'Sales Rep',
        status_c: user.status_c || 'Active'
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name_c.trim()) {
      newErrors.name_c = 'Name is required';
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = 'Invalid email format';
    }

    if (!formData.role_c) {
      newErrors.role_c = 'Role is required';
    }

    if (!formData.status_c) {
      newErrors.status_c = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let result;
      if (user) {
        result = await userService.update(user.Id, formData);
      } else {
        result = await userService.create(formData);
      }

      if (result) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting user form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Name"
        name="name_c"
        value={formData.name_c}
        onChange={handleChange}
        error={errors.name_c}
        required
        placeholder="Enter user name"
      />

      <FormField
        label="Email"
        name="email_c"
        type="email"
        value={formData.email_c}
        onChange={handleChange}
        error={errors.email_c}
        required
        placeholder="Enter email address"
      />

      <FormField
        label="Phone"
        name="phone_c"
        value={formData.phone_c}
        onChange={handleChange}
        error={errors.phone_c}
        placeholder="Enter phone number"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Role <span className="text-red-500">*</span>
        </label>
        <select
          name="role_c"
          value={formData.role_c}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Sales Rep">Sales Rep</option>
          <option value="Support">Support</option>
        </select>
        {errors.role_c && (
          <p className="text-sm text-red-600">{errors.role_c}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          name="status_c"
          value={formData.status_c}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>
        {errors.status_c && (
          <p className="text-sm text-red-600">{errors.status_c}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;