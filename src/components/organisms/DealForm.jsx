import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";

const DealForm = ({ isOpen, onClose, deal, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    contactId: "",
    value: "",
    stage: "lead",
    probability: "10",
    expectedCloseDate: "",
  });
  const [contacts, setContacts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const stages = [
    { value: "lead", label: "Lead", probability: 10 },
    { value: "qualified", label: "Qualified", probability: 25 },
    { value: "proposal", label: "Proposal", probability: 50 },
    { value: "negotiation", label: "Negotiation", probability: 75 },
    { value: "closed-won", label: "Closed Won", probability: 100 },
    { value: "closed-lost", label: "Closed Lost", probability: 0 },
  ];

  useEffect(() => {
    if (isOpen) {
      loadContacts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (deal) {
      const expectedDate = deal.expectedCloseDate ? format(new Date(deal.expectedCloseDate), "yyyy-MM-dd") : "";
      setFormData({
        title: deal.title || "",
        contactId: deal.contactId || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "lead",
        probability: deal.probability?.toString() || "10",
        expectedCloseDate: expectedDate,
      });
    } else {
      setFormData({
        title: "",
        contactId: "",
        value: "",
        stage: "lead",
        probability: "10",
        expectedCloseDate: "",
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const loadContacts = async () => {
    try {
      setLoadingContacts(true);
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (error) {
      toast.error("Failed to load contacts");
    } finally {
      setLoadingContacts(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }

    if (!formData.value || isNaN(formData.value) || parseFloat(formData.value) <= 0) {
      newErrors.value = "Valid deal value is required";
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = "Expected close date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
        expectedCloseDate: new Date(formData.expectedCloseDate),
      };

      if (deal) {
        await dealService.update(deal.Id, dealData);
        toast.success("Deal updated successfully!");
      } else {
        await dealService.create(dealData);
        toast.success("Deal created successfully!");
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save deal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-update probability when stage changes
    if (name === "stage") {
      const selectedStage = stages.find(s => s.value === value);
      if (selectedStage) {
        setFormData(prev => ({ ...prev, probability: selectedStage.probability.toString() }));
      }
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={deal ? "Edit Deal" : "Add New Deal"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Deal Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
          placeholder="Enter deal title"
        />

        <FormField
          label="Contact"
          error={errors.contactId}
          required
        >
          <select
            name="contactId"
            value={formData.contactId}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loadingContacts}
          >
            <option value="">Select a contact</option>
            {contacts.map(contact => (
              <option key={contact.Id} value={contact.Id}>
                {contact.name} - {contact.company}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Deal Value ($)"
          name="value"
          type="number"
          value={formData.value}
          onChange={handleChange}
          error={errors.value}
          required
          placeholder="0.00"
          min="0"
          step="0.01"
        />

        <FormField
          label="Stage"
          error={errors.stage}
          required
        >
          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {stages.map(stage => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Probability (%)"
          name="probability"
          type="number"
          value={formData.probability}
          onChange={handleChange}
          error={errors.probability}
          min="0"
          max="100"
        />

        <FormField
          label="Expected Close Date"
          name="expectedCloseDate"
          type="date"
          value={formData.expectedCloseDate}
          onChange={handleChange}
          error={errors.expectedCloseDate}
          required
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : deal ? "Update Deal" : "Create Deal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DealForm;