import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import taskService from "@/services/api/taskService";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";

const TaskForm = ({ isOpen, onClose, task, onSuccess }) => {
  const [formData, setFormData] = useState({
    title_c: "",
    description_c: "",
    status_c: "open",
    priority_c: "medium",
    due_date_c: "",
    Tags: "",
    contact_id_c: "",
    deal_id_c: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [dealsLoading, setDealsLoading] = useState(false);

  useEffect(() => {
    const loadLookupData = async () => {
      if (!isOpen) return;

      // Load contacts
      setContactsLoading(true);
      try {
        const contactsData = await contactService.getAll();
        setContacts(contactsData);
      } catch (error) {
        console.error("Error loading contacts:", error);
        toast.error("Failed to load contacts");
      } finally {
        setContactsLoading(false);
      }

      // Load deals
      setDealsLoading(true);
      try {
        const dealsData = await dealService.getAll();
        setDeals(dealsData);
      } catch (error) {
        console.error("Error loading deals:", error);
        toast.error("Failed to load deals");
      } finally {
        setDealsLoading(false);
      }
    };

    loadLookupData();

    if (task) {
      setFormData({
        title_c: task.title_c || "",
        description_c: task.description_c || "",
        status_c: task.status_c || "open",
        priority_c: task.priority_c || "medium",
        due_date_c: task.due_date_c ? task.due_date_c.split('T')[0] : "",
        Tags: task.Tags || "",
        contact_id_c: task.contact_id_c?.Id || task.contact_id_c || "",
        deal_id_c: task.deal_id_c?.Id || task.deal_id_c || ""
      });
    } else {
      setFormData({
        title_c: "",
        description_c: "",
        status_c: "open",
        priority_c: "medium",
        due_date_c: "",
        Tags: "",
        contact_id_c: "",
        deal_id_c: ""
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title_c.trim()) {
      newErrors.title_c = "Title is required";
    }

    if (!formData.status_c) {
      newErrors.status_c = "Status is required";
    }

    if (!formData.priority_c) {
      newErrors.priority_c = "Priority is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Format due_date_c as ISO 8601 DateTime if provided
      const submitData = { ...formData };
      if (submitData.due_date_c) {
        submitData.due_date_c = new Date(submitData.due_date_c).toISOString();
      }

      if (task) {
        await taskService.update(task.Id, submitData);
        toast.success("Task updated successfully!");
      } else {
        await taskService.create(submitData);
        toast.success("Task created successfully!");
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save task. Please try again.");
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

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={task ? "Edit Task" : "Add New Task"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Title"
          name="title_c"
          value={formData.title_c}
          onChange={(value) => handleFieldChange('title_c', value)}
          error={errors.title_c}
          required
          placeholder="Enter task title"
        />

        <FormField
          label="Description"
          name="description_c"
          value={formData.description_c}
          onChange={handleChange}
          error={errors.description_c}
          placeholder="Describe the task..."
        >
          <textarea
            name="description_c"
            value={formData.description_c}
            onChange={handleChange}
            className="flex min-h-[80px] w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="Describe the task..."
            rows={3}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Status"
            error={errors.status_c}
            required
          >
            <select
              name="status_c"
              value={formData.status_c}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.status_c ? 'border-error-500' : 'border-gray-300'
              }`}
            >
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
          </FormField>

          <FormField
            label="Priority"
            error={errors.priority_c}
            required
          >
            <select
              name="priority_c"
              value={formData.priority_c}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.priority_c ? 'border-error-500' : 'border-gray-300'
              }`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </FormField>
        </div>

        <FormField
          label="Due Date"
          name="due_date_c"
          type="date"
          value={formData.due_date_c}
          onChange={(value) => handleFieldChange('due_date_c', value)}
          error={errors.due_date_c}
          placeholder="Select due date"
        />

        <FormField
          label="Tags"
          name="Tags"
          value={formData.Tags}
          onChange={(value) => handleFieldChange('Tags', value)}
          error={errors.Tags}
          placeholder="Enter tags (comma-separated)"
        />

        <FormField
          label="Related Contact"
          error={errors.contact_id_c}
        >
          <select
            name="contact_id_c"
            value={formData.contact_id_c}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.contact_id_c ? 'border-error-500' : 'border-gray-300'
            } ${contactsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={contactsLoading}
          >
            <option value="">
              {contactsLoading ? "Loading contacts..." : "Select a contact (optional)"}
            </option>
            {contacts.map((contact) => (
              <option key={contact.Id} value={contact.Id}>
                {contact.name_c || contact.Name || `Contact ${contact.Id}`}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Related Deal"
          error={errors.deal_id_c}
        >
          <select
            name="deal_id_c"
            value={formData.deal_id_c}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.deal_id_c ? 'border-error-500' : 'border-gray-300'
            } ${dealsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={dealsLoading}
          >
            <option value="">
              {dealsLoading ? "Loading deals..." : "Select a deal (optional)"}
            </option>
            {deals.map((deal) => (
              <option key={deal.Id} value={deal.Id}>
                {deal.name_c || deal.Name || `Deal ${deal.Id}`}
              </option>
            ))}
          </select>
        </FormField>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;