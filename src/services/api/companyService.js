const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'company_c';

export const companyService = {
  async getAll() {
    try {
      const params = {
fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching companies:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}}
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(companyData) {
    try {
// Only include Updateable fields for create operation
const updateableData = {
        name_c: companyData.name_c || "",
        industry_c: companyData.industry_c || "",
        website_c: companyData.website_c || "",
        phone_c: companyData.phone_c || "",
        address_c: companyData.address_c || "",
        city_c: companyData.city_c || "",
        state_c: companyData.state_c || "",
        zip_code_c: companyData.zip_code_c || ""
      };
      // Remove empty string fields except for name_c which is required
      const cleanData = {};
      Object.keys(updateableData).forEach(key => {
        if (key === 'name_c') {
          // Always include name_c even if empty (required field)
          cleanData[key] = updateableData[key];
        } else if (updateableData[key] && updateableData[key].trim() !== '') {
          cleanData[key] = updateableData[key];
        }
      });

      const params = {
        records: [cleanData]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} company records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, companyData) {
    try {
// Only include Updateable fields for update operation
const updateableData = {
        Id: parseInt(id),
        name_c: companyData.name_c || "",
        industry_c: companyData.industry_c || "",
        website_c: companyData.website_c || "",
        phone_c: companyData.phone_c || "",
        address_c: companyData.address_c || "",
        city_c: companyData.city_c || "",
        state_c: companyData.state_c || "",
        zip_code_c: companyData.zip_code_c || ""
      };

      // Remove empty string fields except for name_c which is required
      const cleanData = { Id: parseInt(id) };
      Object.keys(updateableData).forEach(key => {
        if (key === 'Id') return; // Already added
        if (key === 'name_c') {
          // Always include name_c even if empty (required field)
          cleanData[key] = updateableData[key];
        } else if (updateableData[key] && updateableData[key].trim() !== '') {
          cleanData[key] = updateableData[key];
        }
      });

      const params = {
        records: [cleanData]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} company records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} company records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful.length === 1;
      }

      return true;
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error);
      throw error;
    }
  }
};