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
    Title_c: "",
    ContactId_c: "",
    Value_c: "",
    Stage_c: "lead",
    Probability_c: "10",
    ExpectedCloseDate_c: "",
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
      const expectedDate = deal.ExpectedCloseDate_c ? format(new Date(deal.ExpectedCloseDate_c), "yyyy-MM-dd") : "";
      setFormData({
        Title_c: deal.Title_c || "",
        ContactId_c: deal.ContactId_c || "",
        Value_c: deal.Value_c?.toString() || "",
        Stage_c: deal.Stage_c || "lead",
        Probability_c: deal.Probability_c?.toString() || "10",
        ExpectedCloseDate_c: expectedDate,
      });
    } else {
      setFormData({
        Title_c: "",
        ContactId_c: "",
        Value_c: "",
        Stage_c: "lead",
        Probability_c: "10",
        ExpectedCloseDate_c: "",
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

    if (!formData.Title_c.trim()) {
      newErrors.Title_c = "Title is required";
    }

    if (!formData.ContactId_c) {
      newErrors.ContactId_c = "Contact is required";
    }

    if (!formData.Value_c || isNaN(formData.Value_c) || parseFloat(formData.Value_c) <= 0) {
      newErrors.Value_c = "Valid deal value is required";
    }

    if (!formData.ExpectedCloseDate_c) {
      newErrors.ExpectedCloseDate_c = "Expected close date is required";
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
        Title_c: formData.Title_c,
        ContactId_c: parseInt(formData.ContactId_c),
        Value_c: parseFloat(formData.Value_c),
        Stage_c: formData.Stage_c,
        Probability_c: parseInt(formData.Probability_c),
        ExpectedCloseDate_c: formData.ExpectedCloseDate_c,
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
    if (name === "Stage_c") {
      const selectedStage = stages.find(s => s.value === value);
      if (selectedStage) {
        setFormData(prev => ({ ...prev, Probability_c: selectedStage.probability.toString() }));
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
          name="Title_c"
          value={formData.Title_c}
          onChange={handleChange}
          error={errors.Title_c}
          required
          placeholder="Enter deal title"
        />

        <FormField
          label="Contact"
          error={errors.ContactId_c}
          required
        >
          <select
            name="ContactId_c"
            value={formData.ContactId_c}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loadingContacts}
          >
            <option value="">Select a contact</option>
            {contacts.map(contact => (
              <option key={contact.Id} value={contact.Id}>
                {contact.Name_c} - {contact.Company_c}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Deal Value ($)"
          name="Value_c"
          type="number"
          value={formData.Value_c}
          onChange={handleChange}
          error={errors.Value_c}
          required
          placeholder="0.00"
          min="0"
          step="0.01"
        />

        <FormField
          label="Stage"
          error={errors.Stage_c}
          required
        >
          <select
            name="Stage_c"
            value={formData.Stage_c}
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
          name="Probability_c"
          type="number"
          value={formData.Probability_c}
          onChange={handleChange}
          error={errors.Probability_c}
          min="0"
          max="100"
        />

        <FormField
          label="Expected Close Date"
          name="ExpectedCloseDate_c"
          type="date"
          value={formData.ExpectedCloseDate_c}
          onChange={handleChange}
          error={errors.ExpectedCloseDate_c}
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