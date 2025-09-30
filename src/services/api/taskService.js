const taskService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "owner_c"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "owner_c"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ]
      };

      const response = await apperClient.getRecordById('task_c', parseInt(id), params);

      if (!response.success) {
        console.error("Error fetching task:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching task:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  create: async (taskData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const record = {};
      if (taskData.Name) record.Name = taskData.Name;
      if (taskData.Tags) record.Tags = taskData.Tags;
      if (taskData.title_c) record.title_c = taskData.title_c;
      if (taskData.description_c) record.description_c = taskData.description_c;
      if (taskData.status_c) record.status_c = taskData.status_c;
      if (taskData.due_date_c) record.due_date_c = taskData.due_date_c;
      if (taskData.priority_c) record.priority_c = taskData.priority_c;
      if (taskData.contact_id_c) record.contact_id_c = parseInt(taskData.contact_id_c);
      if (taskData.deal_id_c) record.deal_id_c = parseInt(taskData.deal_id_c);
      if (taskData.owner_c) record.owner_c = parseInt(taskData.owner_c);

      const params = {
        records: [record]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error("Error creating task:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to create task");
        }

        return successful[0].data;
      }

      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  update: async (id, taskData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const record = { Id: parseInt(id) };
      if (taskData.Name !== undefined) record.Name = taskData.Name;
      if (taskData.Tags !== undefined) record.Tags = taskData.Tags;
      if (taskData.title_c !== undefined) record.title_c = taskData.title_c;
      if (taskData.description_c !== undefined) record.description_c = taskData.description_c;
      if (taskData.status_c !== undefined) record.status_c = taskData.status_c;
      if (taskData.due_date_c !== undefined) record.due_date_c = taskData.due_date_c;
      if (taskData.priority_c !== undefined) record.priority_c = taskData.priority_c;
      if (taskData.contact_id_c !== undefined) record.contact_id_c = taskData.contact_id_c ? parseInt(taskData.contact_id_c) : null;
      if (taskData.deal_id_c !== undefined) record.deal_id_c = taskData.deal_id_c ? parseInt(taskData.deal_id_c) : null;
      if (taskData.owner_c !== undefined) record.owner_c = taskData.owner_c ? parseInt(taskData.owner_c) : null;

      const params = {
        records: [record]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error("Error updating task:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to update task");
        }

        return successful[0].data;
      }

      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error("Error deleting task:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to delete task");
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};

export default taskService;