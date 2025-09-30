const activityService = {
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
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "ContactId_c"}},
          {"field": {"Name": "DealId_c"}},
          {"field": {"Name": "Timestamp_c"}},
          {"field": {"Name": "CreatedDate"}}
        ],
        orderBy: [{"fieldName": "Timestamp_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('activity_c', params);

      if (!response.success) {
        console.error("Error fetching activities:", response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error.message);
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
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "ContactId_c"}},
          {"field": {"Name": "DealId_c"}},
          {"field": {"Name": "Timestamp_c"}},
          {"field": {"Name": "CreatedDate"}}
        ]
      };

      const response = await apperClient.getRecordById('activity_c', parseInt(id), params);

      if (!response.success) {
        console.error("Error fetching activity:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching activity:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  create: async (activityData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Description_c: activityData.Description_c,
          Type_c: activityData.Type_c,
          ContactId_c: activityData.ContactId_c,
          DealId_c: activityData.DealId_c,
          Timestamp_c: activityData.Timestamp_c || new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('activity_c', params);

      if (!response.success) {
        console.error("Error creating activity:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, JSON.stringify(failed));
          throw new Error(failed[0].message || "Failed to create activity");
        }

        return successful[0].data;
      }

      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  update: async (id, activityData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Description_c: activityData.Description_c,
          Type_c: activityData.Type_c,
          ContactId_c: activityData.ContactId_c,
          DealId_c: activityData.DealId_c,
          Timestamp_c: activityData.Timestamp_c
        }]
      };

      const response = await apperClient.updateRecord('activity_c', params);

      if (!response.success) {
        console.error("Error updating activity:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} activities:`, JSON.stringify(failed));
          throw new Error(failed[0].message || "Failed to update activity");
        }

        return successful[0].data;
      }

      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error.message);
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

      const response = await apperClient.deleteRecord('activity_c', params);

      if (!response.success) {
        console.error("Error deleting activity:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} activities:`, JSON.stringify(failed));
          throw new Error(failed[0].message || "Failed to delete activity");
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};

export default activityService;
export default activityService;