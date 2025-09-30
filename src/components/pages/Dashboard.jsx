import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format, subDays } from "date-fns";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import activityService from "@/services/api/activityService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDeals: 0,
    totalValue: 0,
    recentActivities: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [recentDeals, setRecentDeals] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);

      setContacts(contactsData);
      
      // Calculate stats
      const totalValue = dealsData.reduce((sum, deal) => sum + deal.value, 0);
      const recentActivitiesCount = activitiesData.filter(activity => 
        new Date(activity.timestamp) > subDays(new Date(), 7)
      ).length;

      setStats({
        totalContacts: contactsData.length,
        totalDeals: dealsData.length,
        totalValue,
        recentActivities: recentActivitiesCount
      });

      // Get recent data
      setRecentContacts(
        contactsData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
      );
      
      setRecentDeals(
        dealsData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
      );
      
      setRecentActivities(
        activitiesData
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 5)
      );

    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.name : "Unknown Contact";
  };

  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Calendar",
      note: "FileText",
      deal_created: "Plus",
      deal_updated: "Edit",
      contact_created: "UserPlus",
      contact_updated: "UserCheck",
    };
    return icons[type] || "Activity";
  };

  const getStageColor = (stage) => {
    const colors = {
      "lead": "default",
      "qualified": "primary",
      "proposal": "accent",
      "negotiation": "warning",
      "closed-won": "success",
      "closed-lost": "danger",
    };
    return colors[stage] || "default";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary-900 to-secondary-700 bg-clip-text text-transparent">
          Welcome to Contact Pro
        </h1>
        <p className="text-secondary-600 mt-2">
          Here's an overview of your CRM activity and performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Active Deals"
          value={stats.totalDeals}
          icon="TrendingUp"
          color="accent"
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(stats.totalValue)}
          icon="DollarSign"
          color="success"
        />
        <StatCard
          title="This Week's Activities"
          value={stats.recentActivities}
          icon="Activity"
          color="primary"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Users" className="w-5 h-5 text-primary-500" />
                <span>Recent Contacts</span>
              </CardTitle>
              <Link to="/contacts">
                <Button variant="ghost" size="sm">
                  View All
                  <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContacts.length === 0 ? (
                <p className="text-secondary-500 text-center py-8">No contacts yet</p>
              ) : (
                recentContacts.map((contact) => (
                  <div key={contact.Id} className="flex items-center space-x-3">
                    <Avatar fallback={contact.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 truncate">
                        {contact.name}
                      </p>
                      <p className="text-xs text-secondary-500 truncate">
                        {contact.company || contact.email}
                      </p>
                    </div>
                    <div className="text-xs text-secondary-400">
                      {format(new Date(contact.createdAt), "MMM dd")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Deals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="TrendingUp" className="w-5 h-5 text-accent-500" />
                <span>Recent Deals</span>
              </CardTitle>
              <Link to="/deals">
                <Button variant="ghost" size="sm">
                  View All
                  <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeals.length === 0 ? (
                <p className="text-secondary-500 text-center py-8">No deals yet</p>
              ) : (
                recentDeals.map((deal) => (
                  <div key={deal.Id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 truncate">
                        {deal.title}
                      </p>
                      <p className="text-xs text-secondary-500 truncate">
                        {getContactName(deal.contactId)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-accent-600">
                        {formatCurrency(deal.value)}
                      </p>
                      <Badge variant={getStageColor(deal.stage)} size="sm">
                        {deal.stage.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Activity" className="w-5 h-5 text-primary-500" />
                <span>Recent Activities</span>
              </CardTitle>
              <Link to="/activities">
                <Button variant="ghost" size="sm">
                  View All
                  <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-secondary-500 text-center py-8">No recent activities</p>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.Id} className="flex items-start space-x-3">
                    <div className="p-2 bg-secondary-100 rounded-full">
                      <ApperIcon 
                        name={getActivityIcon(activity.type)} 
                        className="w-4 h-4 text-secondary-600" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-secondary-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {getContactName(activity.contactId)} • {format(new Date(activity.timestamp), "MMM dd, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/contacts" className="block">
              <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200 hover:border-primary-300 transition-all group">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-500 rounded-lg group-hover:scale-110 transition-transform">
                    <ApperIcon name="UserPlus" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">Add Contact</p>
                    <p className="text-sm text-secondary-600">Create new customer record</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/deals" className="block">
              <div className="p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg border border-accent-200 hover:border-accent-300 transition-all group">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent-500 rounded-lg group-hover:scale-110 transition-transform">
                    <ApperIcon name="Plus" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">Create Deal</p>
                    <p className="text-sm text-secondary-600">Add new sales opportunity</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/activities" className="block">
              <div className="p-4 bg-gradient-to-br from-success-50 to-success-100 rounded-lg border border-success-200 hover:border-success-300 transition-all group">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success-500 rounded-lg group-hover:scale-110 transition-transform">
                    <ApperIcon name="Calendar" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">View Activities</p>
                    <p className="text-sm text-secondary-600">Track all interactions</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;