import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format, isValid } from "date-fns";
import { Card, CardContent } from "@/components/atoms/Card";
import ContactForm from "@/components/organisms/ContactForm";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import contactService from "@/services/api/contactService";

// Safe date formatting utility
const safeFormat = (date, formatStr) => {
  if (!date) return 'No date';
  const dateObj = new Date(date);
  return isValid(dateObj) ? format(dateObj, formatStr) : 'Invalid date';
};

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
if (searchTerm) {
const filtered = contacts.filter(contact =>
        contact.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.company_c && contact.company_c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [contacts, searchTerm]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await contactService.delete(contactId);
      toast.success("Contact deleted successfully!");
      loadContacts();
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const handleFormSuccess = () => {
    loadContacts();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Contacts</h1>
          <p className="text-secondary-600">Manage your customer relationships</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts..."
          className="sm:max-w-xs"
        />
        <div className="flex items-center space-x-2 text-sm text-secondary-600">
          <span>Total: {filteredContacts.length} contacts</span>
        </div>
      </div>

      {/* Contacts Grid */}
      {filteredContacts.length === 0 ? (
        <Empty 
          title="No contacts found"
          description={searchTerm ? "Try adjusting your search criteria" : "Start building your customer base by adding your first contact"}
          actionLabel={searchTerm ? undefined : "Add Contact"}
          onAction={searchTerm ? undefined : () => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <Card key={contact.Id} className="group hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
<Avatar 
fallback={contact.name_c}
                      size="md"
                    />
                    <div>
                      <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
{contact.name_c}
                      </h3>
{contact.company_c && (
                        <p className="text-sm text-secondary-500">{contact.company_c}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(contact)}
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(contact.Id)}
                      className="text-error-500 hover:text-error-600"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

<div className="space-y-2">
                  <div className="flex items-center text-sm text-secondary-600">
                    <ApperIcon name="Mail" className="w-4 h-4 mr-2 text-secondary-400" />
                    <span className="truncate">{contact.email_c}</span>
                  </div>
                  <div className="flex items-center text-sm text-secondary-600">
                    <ApperIcon name="Phone" className="w-4 h-4 mr-2 text-secondary-400" />
                    <span className="truncate">{contact.phone_c}</span>
                  </div>
                  {contact.notes_c && (
                    <div className="flex items-start text-sm text-secondary-600 mt-3">
                      <ApperIcon name="FileText" className="w-4 h-4 mr-2 text-secondary-400 mt-0.5" />
                      <span className="line-clamp-2">{contact.notes_c}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-100">
                  <Badge variant="default" size="sm">
Added {safeFormat(contact.CreatedDate, "MMM dd")}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <button className="text-secondary-400 hover:text-primary-500 transition-colors">
                      <ApperIcon name="Phone" className="w-4 h-4" />
                    </button>
                    <button className="text-secondary-400 hover:text-primary-500 transition-colors">
                      <ApperIcon name="Mail" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={showForm}
        onClose={handleFormClose}
        contact={editingContact}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default ContactList;