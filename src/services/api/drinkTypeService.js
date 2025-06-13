import drinkTypes from '@/services/mockData/drinkTypes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DrinkTypeService {
  constructor() {
    this.data = [...drinkTypes];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(150);
    const item = this.data.find(type => type.id === id);
    return item ? { ...item } : null;
  }

  async getByValue(value) {
    await delay(150);
    const item = this.data.find(type => type.value === value);
    return item ? { ...item } : null;
  }

  async getActiveTypes() {
    await delay(200);
    return this.data.filter(type => type.active).map(type => ({ ...type }));
  }

  async create(item) {
    await delay(300);
    const newType = {
      ...item,
      id: Date.now().toString(),
      active: item.active !== false
    };
    this.data.push(newType);
    return { ...newType };
  }

  async update(id, data) {
    await delay(250);
    const index = this.data.findIndex(type => type.id === id);
    if (index === -1) throw new Error('Drink type not found');
    
    this.data[index] = { ...this.data[index], ...data };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(type => type.id === id);
    if (index === -1) throw new Error('Drink type not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async getHydrationMultiplier(drinkType) {
    await delay(100);
    const type = this.data.find(t => t.value === drinkType);
    return type ? type.hydrationMultiplier : 1.0;
  }
}

export default new DrinkTypeService();