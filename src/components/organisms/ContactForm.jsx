import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import contactService from "@/services/api/contactService";

const ContactForm = ({ isOpen, onClose, contact, onSuccess }) => {
const [formData, setFormData] = useState({
    name_c: "",
    email_c: "",
    phone_c: "",
    company_c: "",
    notes_c: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contact) {
setFormData({
        name_c: contact.name_c || "",
        email_c: contact.email_c || "",
        phone_c: contact.phone_c || "",
        company_c: contact.company_c || "",
        notes_c: contact.notes_c || "",
      });
    } else {
setFormData({
        name_c: "",
        email_c: "",
        phone_c: "",
        company_c: "",
        notes_c: "",
      });
    }
    setErrors({});
  }, [contact, isOpen]);

  const validateForm = () => {
    const newErrors = {};

if (!formData.name_c.trim()) {
      newErrors.name_c = "Name is required";
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Email is invalid";
    }

    if (!formData.phone_c.trim()) {
      newErrors.phone_c = "Phone is required";
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
name="name_c"
          value={formData.name_c}
          onChange={handleChange}
          error={errors.Name_c}
          required
          placeholder="Enter full name"
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
          error={errors.Phone_c}
          required
          placeholder="Enter phone number"
        />

        <FormField
          label="Company"
name="company_c"
          value={formData.company_c}
          onChange={handleChange}
          error={errors.Company_c}
          placeholder="Enter company name"
        />

        <FormField
          label="Notes"
name="notes_c"
          value={formData.notes_c}
          onChange={handleChange}
          error={errors.Notes_c}
          placeholder="Additional notes..."
        >
          <textarea
name="notes_c"
            value={formData.notes_c}
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