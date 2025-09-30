import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import contactService from "@/services/api/contactService";

const ContactForm = ({ isOpen, onClose, contact, onSuccess }) => {
const [formData, setFormData] = useState({
    Name_c: "",
    Email_c: "",
    Phone_c: "",
    Company_c: "",
    Notes_c: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contact) {
setFormData({
        Name_c: contact.Name_c || "",
        Email_c: contact.Email_c || "",
        Phone_c: contact.Phone_c || "",
        Company_c: contact.Company_c || "",
        Notes_c: contact.Notes_c || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        notes: "",
      });
    }
    setErrors({});
  }, [contact, isOpen]);

  const validateForm = () => {
    const newErrors = {};

if (!formData.Name_c.trim()) {
      newErrors.Name_c = "Name is required";
    }

    if (!formData.Email_c.trim()) {
      newErrors.Email_c = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.Email_c)) {
      newErrors.Email_c = "Email is invalid";
    }

    if (!formData.Phone_c.trim()) {
      newErrors.Phone_c = "Phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (contact) {
        await contactService.update(contact.Id, formData);
        toast.success("Contact updated successfully!");
      } else {
        const newContact = await contactService.create(formData);
        toast.success("Contact created successfully!");
        
        // Sync with CompanyHub in background
        try {
          const { ApperClient } = window.ApperSDK;
          const apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
          });

          const companyHubResult = await apperClient.functions.invoke(import.meta.env.VITE_CREATE_COMPANYHUB_CONTACT, {
            body: JSON.stringify(newContact),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (companyHubResult.success) {
            toast.success("Contact synced with CompanyHub!");
          } else {
            console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_CREATE_COMPANYHUB_CONTACT}. The response body is: ${JSON.stringify(companyHubResult)}.`);
            toast.info("Contact created locally, but CompanyHub sync failed.");
          }
        } catch (companyHubError) {
          console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_CREATE_COMPANYHUB_CONTACT}. The error is: ${companyHubError.message}`);
          toast.info("Contact created locally, but CompanyHub sync failed.");
        }
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={contact ? "Edit Contact" : "Add New Contact"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Name"
name="Name_c"
          value={formData.Name_c}
          onChange={handleChange}
          error={errors.Name_c}
          required
          placeholder="Enter full name"
        />

        <FormField
          label="Email"
          name="Email_c"
          type="email"
          value={formData.Email_c}
          onChange={handleChange}
          error={errors.Email_c}
          required
          placeholder="Enter email address"
        />

        <FormField
          label="Phone"
          name="Phone_c"
          value={formData.Phone_c}
          onChange={handleChange}
          error={errors.Phone_c}
          required
          placeholder="Enter phone number"
        />

        <FormField
          label="Company"
          name="Company_c"
          value={formData.Company_c}
          onChange={handleChange}
          error={errors.Company_c}
          placeholder="Enter company name"
        />

        <FormField
          label="Notes"
          name="Notes_c"
          value={formData.Notes_c}
          onChange={handleChange}
          error={errors.Notes_c}
          placeholder="Additional notes..."
        >
          <textarea
            name="Notes_c"
            value={formData.Notes_c}
            onChange={handleChange}
            className="flex min-h-[80px] w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="Additional notes..."
            rows={3}
          />
        </FormField>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : contact ? "Update Contact" : "Create Contact"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ContactForm;