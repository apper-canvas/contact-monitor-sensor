import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

const contactService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...contacts];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  },

  create: async (contactData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = contacts.reduce((max, contact) => 
      contact.Id > max ? contact.Id : max, 0
    );
    
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    contacts.push(newContact);
    return { ...newContact };
  },

  update: async (id, contactData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    contacts[index] = {
      ...contacts[index],
      ...contactData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...contacts[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    const deleted = contacts.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default contactService;