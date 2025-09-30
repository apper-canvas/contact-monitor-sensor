import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.tableName = 'user_c';
  }

  async getAll(searchTerm = '', roleFilter = '', sortBy = 'name_c', sortOrder = 'ASC') {
    try {
      await delay(300);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const where = [];
      const whereGroups = [];

      // Search filter
      if (searchTerm) {
        whereGroups.push({
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "name_c", operator: "Contains", values: [searchTerm] },
                { fieldName: "email_c", operator: "Contains", values: [searchTerm] }
              ],
              operator: "OR"
            }
          ]
        });
      }

      // Role filter
      if (roleFilter) {
        where.push({
          FieldName: "role_c",
          Operator: "ExactMatch",
          Values: [roleFilter]
        });
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "createdDate_c" } },
          { field: { Name: "lastModifiedDate_c" } }
        ],
        where: where,
        whereGroups: whereGroups.length > 0 ? whereGroups : undefined,
        orderBy: [{ fieldName: sortBy, sorttype: sortOrder }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error?.response?.data?.message || error);
      toast.error("Failed to load users");
      return [];
    }
  }

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "status_c" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load user details");
      return null;
    }
  }

  async create(userData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const record = {};
      if (userData.name_c) record.name_c = userData.name_c;
      if (userData.email_c) record.email_c = userData.email_c;
      if (userData.phone_c) record.phone_c = userData.phone_c;
      if (userData.role_c) record.role_c = userData.role_c;
      if (userData.status_c) record.status_c = userData.status_c;

      const params = {
        records: [record]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create user: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success("User created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating user:", error?.response?.data?.message || error);
      toast.error("Failed to create user");
      return null;
    }
  }

  async update(id, userData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const record = { Id: id };
      if (userData.name_c !== undefined) record.name_c = userData.name_c;
      if (userData.email_c !== undefined) record.email_c = userData.email_c;
      if (userData.phone_c !== undefined) record.phone_c = userData.phone_c;
      if (userData.role_c !== undefined) record.role_c = userData.role_c;
      if (userData.status_c !== undefined) record.status_c = userData.status_c;

      const params = {
        records: [record]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update user: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success("User updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating user:", error?.response?.data?.message || error);
      toast.error("Failed to update user");
      return null;
    }
  }

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete user: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        if (successful.length > 0) {
          toast.success("User deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting user:", error?.response?.data?.message || error);
      toast.error("Failed to delete user");
      return false;
    }
  }
}

export const userService = new UserService();