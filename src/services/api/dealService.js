const dealService = {
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
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "ContactId_c"}},
          {"field": {"Name": "Value_c"}},
          {"field": {"Name": "Stage_c"}},
          {"field": {"Name": "Probability_c"}},
          {"field": {"Name": "ExpectedCloseDate_c"}},
          {"field": {"Name": "CreatedDate"}}
        ],
        orderBy: [{"fieldName": "CreatedDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('deal_c', params);

      if (!response.success) {
        console.error("Error fetching deals:", response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error.message);
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
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "ContactId_c"}},
          {"field": {"Name": "Value_c"}},
          {"field": {"Name": "Stage_c"}},
          {"field": {"Name": "Probability_c"}},
          {"field": {"Name": "ExpectedCloseDate_c"}},
          {"field": {"Name": "CreatedDate"}}
        ]
      };

      const response = await apperClient.getRecordById('deal_c', parseInt(id), params);

      if (!response.success) {
        console.error("Error fetching deal:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching deal:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  create: async (dealData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Title_c: dealData.Title_c,
          ContactId_c: dealData.ContactId_c,
          Value_c: dealData.Value_c,
          Stage_c: dealData.Stage_c,
          Probability_c: dealData.Probability_c,
          ExpectedCloseDate_c: dealData.ExpectedCloseDate_c
        }]
      };

      const response = await apperClient.createRecord('deal_c', params);

      if (!response.success) {
        console.error("Error creating deal:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals:`, JSON.stringify(failed));
          throw new Error(failed[0].message || "Failed to create deal");
        }

        return successful[0].data;
      }

      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  update: async (id, dealData) => {
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
          Title_c: dealData.Title_c,
          ContactId_c: dealData.ContactId_c,
          Value_c: dealData.Value_c,
          Stage_c: dealData.Stage_c,
          Probability_c: dealData.Probability_c,
          ExpectedCloseDate_c: dealData.ExpectedCloseDate_c
        }]
      };

      const response = await apperClient.updateRecord('deal_c', params);

      if (!response.success) {
        console.error("Error updating deal:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, JSON.stringify(failed));
          throw new Error(failed[0].message || "Failed to update deal");
        }

        return successful[0].data;
      }

      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error.message);
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

      const response = await apperClient.deleteRecord('deal_c', params);

      if (!response.success) {
        console.error("Error deleting deal:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deals:`, JSON.stringify(failed));
          throw new Error(failed[0].message || "Failed to delete deal");
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};

export default dealService;