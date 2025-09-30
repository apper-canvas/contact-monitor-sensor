const contactService = {
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
{"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedDate"}}
        ],
        orderBy: [{"fieldName": "CreatedDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('contact_c', params);

      if (!response.success) {
        console.error("Error fetching contacts:", response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error.message);
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
{"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedDate"}}
        ]
      };

      const response = await apperClient.getRecordById('contact_c', parseInt(id), params);

      if (!response.success) {
        console.error("Error fetching contact:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching contact:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  create: async (contactData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
name_c: contactData.name_c,
          email_c: contactData.email_c,
          phone_c: contactData.phone_c,
          company_c: contactData.company_c,
          notes_c: contactData.notes_c
        }]
      };

      const response = await apperClient.createRecord('contact_c', params);

      if (!response.success) {
        console.error("Error creating contact:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, JSON.stringify(failed));
          throw new Error(failed[0].message || "Failed to create contact");
        }

        return successful[0].data;
      }

      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  update: async (id, contactData) => {
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
name_c: contactData.name_c,
          email_c: contactData.email_c,
          phone_c: contactData.phone_c,
          company_c: contactData.company_c,
          notes_c: contactData.notes_c
        }]
      };

      const response = await apperClient.updateRecord('contact_c', params);

      if (!response.success) {
        console.error("Error updating contact:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, JSON.stringify(failed));
          throw new Error(failed[0].message || "Failed to update contact");
        }

        return successful[0].data;
      }

      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error.message);
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

      const response = await apperClient.deleteRecord('contact_c', params);

      if (!response.success) {
        console.error("Error deleting contact:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, JSON.stringify(failed));
          throw new Error(failed[0].message || "Failed to delete contact");
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};

export default contactService;