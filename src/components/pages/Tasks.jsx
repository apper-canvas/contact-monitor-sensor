import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format, isValid } from "date-fns";
import { Card, CardContent } from "@/components/atoms/Card";
import TaskForm from "@/components/organisms/TaskForm";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import taskService from "@/services/api/taskService";

// Safe date formatting utility
const safeFormat = (date, formatStr) => {
  if (!date) return 'No date';
  const dateObj = new Date(date);
  return isValid(dateObj) ? format(dateObj, formatStr) : 'Invalid date';
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.status_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status_c === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority_c === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskService.delete(taskId);
      toast.success("Task deleted successfully!");
      loadTasks();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFormSuccess = () => {
    loadTasks();
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-blue-100 text-blue-800',
      'in progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'blocked': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-orange-100 text-orange-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Tasks</h1>
          <p className="text-secondary-600">Manage your tasks and to-dos</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks..."
          className="sm:max-w-xs"
        />
        
        <div className="flex flex-wrap gap-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-secondary-700">Status:</span>
            <div className="flex space-x-2">
              <Button
                variant={statusFilter === "all" ? "default" : "secondary"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "open" ? "default" : "secondary"}
                size="sm"
                onClick={() => setStatusFilter("open")}
              >
                Open
              </Button>
              <Button
                variant={statusFilter === "in progress" ? "default" : "secondary"}
                size="sm"
                onClick={() => setStatusFilter("in progress")}
              >
                In Progress
              </Button>
              <Button
                variant={statusFilter === "completed" ? "default" : "secondary"}
                size="sm"
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === "blocked" ? "default" : "secondary"}
                size="sm"
                onClick={() => setStatusFilter("blocked")}
              >
                Blocked
              </Button>
            </div>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-secondary-700">Priority:</span>
            <div className="flex space-x-2">
              <Button
                variant={priorityFilter === "all" ? "default" : "secondary"}
                size="sm"
                onClick={() => setPriorityFilter("all")}
              >
                All
              </Button>
              <Button
                variant={priorityFilter === "low" ? "default" : "secondary"}
                size="sm"
                onClick={() => setPriorityFilter("low")}
              >
                Low
              </Button>
              <Button
                variant={priorityFilter === "medium" ? "default" : "secondary"}
                size="sm"
                onClick={() => setPriorityFilter("medium")}
              >
                Medium
              </Button>
              <Button
                variant={priorityFilter === "high" ? "default" : "secondary"}
                size="sm"
                onClick={() => setPriorityFilter("high")}
              >
                High
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary-600">
            Total: {filteredTasks.length} tasks
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <Empty 
          title="No tasks found"
          description={searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
            ? "Try adjusting your search or filters" 
            : "Start organizing your work by adding your first task"}
          actionLabel={searchTerm || statusFilter !== "all" || priorityFilter !== "all" ? undefined : "Add Task"}
          onAction={searchTerm || statusFilter !== "all" || priorityFilter !== "all" ? undefined : () => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.Id} className="group hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors mb-2">
                      {task.title_c || task.Name || "Untitled Task"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(task.status_c)} size="sm">
                        {task.status_c || "unknown"}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority_c)} size="sm">
                        {task.priority_c || "unknown"} priority
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(task)}
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(task.Id)}
                      className="text-error-500 hover:text-error-600"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {task.description_c && (
                  <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
                    {task.description_c}
                  </p>
                )}

                <div className="space-y-2">
                  {task.due_date_c && (
                    <div className="flex items-center text-sm text-secondary-600">
                      <ApperIcon name="Calendar" className="w-4 h-4 mr-2 text-secondary-400" />
                      <span>Due: {safeFormat(task.due_date_c, "MMM dd, yyyy")}</span>
                    </div>
                  )}
                  {task.contact_id_c && (
                    <div className="flex items-center text-sm text-secondary-600">
                      <ApperIcon name="User" className="w-4 h-4 mr-2 text-secondary-400" />
                      <span>Contact: {task.contact_id_c.Name || `#${task.contact_id_c.Id || task.contact_id_c}`}</span>
                    </div>
                  )}
                  {task.deal_id_c && (
                    <div className="flex items-center text-sm text-secondary-600">
                      <ApperIcon name="DollarSign" className="w-4 h-4 mr-2 text-secondary-400" />
                      <span>Deal: {task.deal_id_c.Name || `#${task.deal_id_c.Id || task.deal_id_c}`}</span>
                    </div>
                  )}
                  {task.Tags && (
                    <div className="flex items-center text-sm text-secondary-600">
                      <ApperIcon name="Tag" className="w-4 h-4 mr-2 text-secondary-400" />
                      <span className="truncate">{task.Tags}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-100">
                  <Badge variant="default" size="sm">
                    Created {safeFormat(task.CreatedOn, "MMM dd")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showForm}
        onClose={handleFormClose}
        task={editingTask}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default Tasks;