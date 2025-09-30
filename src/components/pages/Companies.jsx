import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { companyService } from "@/services/api/companyService";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Industry: "",
    Website: "",
    Phone: "",
    Email: "",
    Description: ""
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAll();
      setCompanies(data || []);
    } catch (err) {
      console.error("Error loading companies:", err?.response?.data?.message || err);
      setError("Failed to load companies. Please try again.");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredCompanies = companies.filter((company) =>
    company.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.Industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.Email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormData({
      Name: "",
      Industry: "",
      Website: "",
      Phone: "",
      Email: "",
      Description: ""
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setFormData({
      Name: company.Name || "",
      Industry: company.Industry || "",
      Website: company.Website || "",
      Phone: company.Phone || "",
      Email: company.Email || "",
      Description: company.Description || ""
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (company) => {
    setSelectedCompany(company);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isCreateModalOpen) {
        await companyService.create(formData);
        toast.success("Company created successfully!");
        setIsCreateModalOpen(false);
      } else if (isEditModalOpen) {
        await companyService.update(selectedCompany.Id, formData);
        toast.success("Company updated successfully!");
        setIsEditModalOpen(false);
      }
      
      await loadCompanies();
      setFormData({
        Name: "",
        Industry: "",
        Website: "",
        Phone: "",
        Email: "",
        Description: ""
      });
    } catch (err) {
      console.error("Error saving company:", err?.response?.data?.message || err);
      toast.error("Failed to save company. Please try again.");
    }
  };

  const confirmDelete = async () => {
    try {
      await companyService.delete(selectedCompany.Id);
      toast.success("Company deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedCompany(null);
      await loadCompanies();
    } catch (err) {
      console.error("Error deleting company:", err?.response?.data?.message || err);
      toast.error("Failed to delete company. Please try again.");
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Company Name"
        required
        value={formData.Name}
        onChange={(value) => handleFormChange("Name", value)}
        placeholder="Enter company name"
      />
      
      <FormField
        label="Industry"
        value={formData.Industry}
        onChange={(value) => handleFormChange("Industry", value)}
        placeholder="Enter industry"
      />
      
      <FormField
        label="Website"
        value={formData.Website}
        onChange={(value) => handleFormChange("Website", value)}
        placeholder="https://example.com"
      />
      
      <FormField
        label="Phone"
        value={formData.Phone}
        onChange={(value) => handleFormChange("Phone", value)}
        placeholder="Enter phone number"
      />
      
      <FormField
        label="Email"
        value={formData.Email}
        onChange={(value) => handleFormChange("Email", value)}
        placeholder="contact@company.com"
      />
      
      <FormField
        label="Description"
        value={formData.Description}
        onChange={(value) => handleFormChange("Description", value)}
        placeholder="Company description"
        multiline
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {isCreateModalOpen ? "Create Company" : "Update Company"}
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return <Loading message="Loading companies..." />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadCompanies}
      />
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Companies
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your company relationships
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            Add Company
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar
          placeholder="Search companies..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {filteredCompanies.length === 0 ? (
        <Empty
          icon="Building2"
          title="No companies found"
          description={searchTerm ? "No companies match your search criteria." : "Start by adding your first company."}
          actionLabel="Add Company"
          onAction={handleCreate}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <motion.div
              key={company.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Building2" className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {company.Name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {company.Industry || "Industry not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(company);
                      }}
                    >
                      <ApperIcon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(company);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {company.Website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Globe" size={14} className="mr-2" />
                      <a 
                        href={company.Website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-600"
                      >
                        {company.Website}
                      </a>
                    </div>
                  )}
                  {company.Email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Mail" size={14} className="mr-2" />
                      <a href={`mailto:${company.Email}`} className="hover:text-blue-600">
                        {company.Email}
                      </a>
                    </div>
                  )}
                  {company.Phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Phone" size={14} className="mr-2" />
                      <a href={`tel:${company.Phone}`} className="hover:text-blue-600">
                        {company.Phone}
                      </a>
                    </div>
                  )}
                </div>

                {company.Description && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {company.Description}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Company"
      >
        {renderForm()}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Company"
      >
        {renderForm()}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Company"
      >
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <ApperIcon name="AlertTriangle" className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete Company
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete "{selectedCompany?.Name}"? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Delete Company
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Companies;