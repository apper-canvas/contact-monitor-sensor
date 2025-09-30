import React, { useState, useEffect } from "react";
import { format, isToday, isYesterday, isValid } from "date-fns";

// Safe date formatting utilities
const safeFormat = (date, formatStr) => {
  if (!date) return 'Invalid date';
  const dateObj = new Date(date);
  return isValid(dateObj) ? format(dateObj, formatStr) : 'Invalid date';
};

const safeDateObj = (date) => {
  if (!date) return null;
  const dateObj = new Date(date);
  return isValid(dateObj) ? dateObj : null;
};
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import activityService from "@/services/api/activityService";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

const getContactName = (contactId) => {
    if (!contactId) return "Unknown Contact";
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.Name_c : "Unknown Contact";
  };

  const getDealTitle = (dealId) => {
    if (!dealId) return null;
    const deal = deals.find(d => d.Id === dealId);
    return deal ? deal.Title_c : "Unknown Deal";
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

  const getActivityColor = (type) => {
    const colors = {
      call: "text-blue-500",
      email: "text-green-500",
      meeting: "text-purple-500",
      note: "text-accent-500",
      deal_created: "text-success-500",
      deal_updated: "text-blue-500",
      contact_created: "text-primary-500",
      contact_updated: "text-secondary-500",
    };
    return colors[type] || "text-secondary-500";
  };

  const formatDate = (date) => {
const activityDate = safeDateObj(date);
    if (!activityDate) return 'Invalid date';
    if (isToday(activityDate)) {
      return "Today";
    } else if (isYesterday(activityDate)) {
      return "Yesterday";
    } else {
      return format(activityDate, "MMM dd, yyyy");
    }
  };

const formatTime = (date) => {
    return safeFormat(date, "h:mm a");
  };
  
  const safeFormatTime = (date) => {
    return format(new Date(date), "h:mm a");
  };

const groupedActivities = activities.reduce((groups, activity) => {
const dateKey = formatDate(activity.Timestamp_c);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(activity);
    return groups;
  }, {});

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Activities</h1>
        <p className="text-secondary-600">Track all interactions and updates</p>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
{[
          { label: "Total Activities", value: activities.length, icon: "Activity" },
          { label: "Calls", value: activities.filter(a => a.Type_c === "call").length, icon: "Phone" },
          { label: "Emails", value: activities.filter(a => a.Type_c === "email").length, icon: "Mail" },
          { label: "Meetings", value: activities.filter(a => a.Type_c === "meeting").length, icon: "Calendar" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                  <ApperIcon name={stat.icon} className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
              <p className="text-sm text-secondary-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Timeline */}
      {activities.length === 0 ? (
        <Empty 
          title="No activities yet"
          description="Activities will appear here as you interact with contacts and deals"
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, dayActivities]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 sticky top-0 bg-secondary-50 px-3 py-2 rounded-lg">
                {date}
              </h3>
              <div className="space-y-4">
                {dayActivities
.sort((a, b) => {
  const dateA = safeDateObj(b.Timestamp_c);
  const dateB = safeDateObj(a.Timestamp_c);
  if (!dateA && !dateB) return 0;
  if (!dateA) return 1;
  if (!dateB) return -1;
  return dateA - dateB;
})
                  .map((activity) => (
                    <Card key={activity.Id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-full bg-secondary-100 ${getActivityColor(activity.Type_c)}`}>
                            <ApperIcon 
                              name={getActivityIcon(activity.Type_c)} 
                              className="w-4 h-4" 
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-secondary-900">
                                  {activity.Description_c}
                                </p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-sm text-secondary-600">
                                    {getContactName(activity.ContactId_c)}
                                  </span>
                                  {activity.DealId_c && (
                                    <Badge variant="secondary" size="sm">
                                      {getDealTitle(activity.DealId_c)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-secondary-500">
                                  {formatTime(activity.Timestamp_c)}
                                </p>
                                <Badge 
                                  variant={
                                    activity.Type_c === "deal_created" || activity.Type_c === "contact_created" 
                                      ? "success" 
                                      : "default"
                                  } 
                                  size="sm" 
                                  className="mt-1"
                                >
                                  {activity.Type_c.replace("_", " ")}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;