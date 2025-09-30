import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

const dealService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...deals];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  },

  create: async (dealData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = deals.reduce((max, deal) => 
      deal.Id > max ? deal.Id : max, 0
    );
    
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      createdAt: new Date().toISOString()
    };
    
    deals.push(newDeal);
    return { ...newDeal };
  },

  update: async (id, dealData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    deals[index] = {
      ...deals[index],
      ...dealData
    };
    
    return { ...deals[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    const deleted = deals.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default dealService;