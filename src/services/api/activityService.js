import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

const activityService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...activities];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const activity = activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  },

  create: async (activityData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = activities.reduce((max, activity) => 
      activity.Id > max ? activity.Id : max, 0
    );
    
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      timestamp: new Date().toISOString()
    };
    
    activities.push(newActivity);
    return { ...newActivity };
  },

  update: async (id, activityData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    activities[index] = {
      ...activities[index],
      ...activityData
    };
    
    return { ...activities[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    const deleted = activities.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default activityService;