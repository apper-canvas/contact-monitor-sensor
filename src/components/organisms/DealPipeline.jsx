import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import DealForm from "./DealForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";

const DealPipeline = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  const stages = [
    { key: "lead", label: "Lead", color: "bg-secondary-500" },
    { key: "qualified", label: "Qualified", color: "bg-blue-500" },
    { key: "proposal", label: "Proposal", color: "bg-accent-500" },
    { key: "negotiation", label: "Negotiation", color: "bg-orange-500" },
    { key: "closed-won", label: "Closed Won", color: "bg-success-500" },
    { key: "closed-lost", label: "Closed Lost", color: "bg-error-500" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.name : "Unknown Contact";
  };

  const getContactCompany = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.company : "";
  };

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getTotalValueByStage = (stage) => {
    return getDealsByStage(stage).reduce((total, deal) => total + deal.value, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setShowForm(true);
  };

  const handleDelete = async (dealId) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;

    try {
      await dealService.delete(dealId);
      toast.success("Deal deleted successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to delete deal");
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDeal(null);
  };

  const handleFormSuccess = () => {
    loadData();
  };

  const getStageVariant = (stage) => {
    const variants = {
      "lead": "default",
      "qualified": "primary",
      "proposal": "accent",
      "negotiation": "warning",
      "closed-won": "success",
      "closed-lost": "danger",
    };
    return variants[stage] || "default";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Deal Pipeline</h1>
          <p className="text-secondary-600">Track and manage your sales opportunities</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.key);
          const stageValue = getTotalValueByStage(stage.key);
          
          return (
            <Card key={stage.key} className="text-center">
              <CardContent className="p-4">
                <div className={`w-4 h-4 rounded-full ${stage.color} mx-auto mb-2`} />
                <p className="text-sm font-medium text-secondary-900">{stage.label}</p>
                <p className="text-xs text-secondary-500 mt-1">
                  {stageDeals.length} deals
                </p>
                <p className="text-sm font-semibold text-secondary-900 mt-1">
                  {formatCurrency(stageValue)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pipeline Columns */}
      {deals.length === 0 ? (
        <Empty 
          title="No deals in pipeline"
          description="Start building your sales pipeline by adding your first deal"
          actionLabel="Add Deal"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {stages.slice(0, 4).map((stage) => {
            const stageDeals = getDealsByStage(stage.key);
            
            return (
              <Card key={stage.key} className="h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                      <span className="text-sm font-medium">{stage.label}</span>
                    </div>
                    <Badge variant="secondary" size="sm">
                      {stageDeals.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {stageDeals.length === 0 ? (
                      <p className="text-sm text-secondary-500 text-center py-8">
                        No deals in this stage
                      </p>
                    ) : (
                      stageDeals.map((deal) => (
                        <motion.div
                          key={deal.Id}
                          layout
                          className="p-4 bg-secondary-50 rounded-lg border border-secondary-200 hover:border-secondary-300 transition-all group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                              {deal.title}
                            </h4>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(deal)}
                                className="h-6 w-6 p-0"
                              >
                                <ApperIcon name="Edit" className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(deal.Id)}
                                className="h-6 w-6 p-0 text-error-500 hover:text-error-600"
                              >
                                <ApperIcon name="Trash2" className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-sm text-secondary-600">
                            <p className="font-medium">{getContactName(deal.contactId)}</p>
                            {getContactCompany(deal.contactId) && (
                              <p className="text-xs">{getContactCompany(deal.contactId)}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-semibold text-accent-600">
                              {formatCurrency(deal.value)}
                            </span>
                            <Badge variant={getStageVariant(deal.stage)} size="sm">
                              {deal.probability}%
                            </Badge>
                          </div>
                          
                          <div className="flex items-center text-xs text-secondary-500 mt-2">
                            <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                            Close: {format(new Date(deal.expectedCloseDate), "MMM dd")}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Deal Form Modal */}
      <DealForm
        isOpen={showForm}
        onClose={handleFormClose}
        deal={editingDeal}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default DealPipeline;