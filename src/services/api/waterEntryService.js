import waterEntries from '@/services/mockData/waterEntries.json';
import drinkTypeService from '@/services/api/drinkTypeService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WaterEntryService {
  constructor() {
    this.data = [...waterEntries];

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(entry => entry.id === id);
    return item ? { ...item } : null;
  }

  async getTodaysEntries() {
    await delay(250);
    const today = new Date().toDateString();
    return this.data.filter(entry => 
      new Date(entry.timestamp).toDateString() === today
    ).map(entry => ({ ...entry }));
  }

  async getEntriesByDateRange(startDate, endDate) {
    await delay(300);
    return this.data.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startDate && entryDate <= endDate;
    }).map(entry => ({ ...entry }));
  }

async create(item) {
    await delay(400);
    const multiplier = await drinkTypeService.getHydrationMultiplier(item.drinkType || 'water');
    const hydrationPoints = Math.round((item.amount * multiplier) * 100) / 100;
    
    const newEntry = {
      ...item,
      id: Date.now().toString(),
      timestamp: item.timestamp || new Date().toISOString(),
      hydrationPoints,
      hydrationMultiplier: multiplier
    };
    this.data.push(newEntry);
    return { ...newEntry };

async update(id, data) {
    await delay(350);
    const index = this.data.findIndex(entry => entry.id === id);
    if (index === -1) throw new Error('Entry not found');
    
    const multiplier = await drinkTypeService.getHydrationMultiplier(data.drinkType || this.data[index].drinkType);
    const hydrationPoints = data.amount ? Math.round((data.amount * multiplier) * 100) / 100 : this.data[index].hydrationPoints;
    
    this.data[index] = { 
      ...this.data[index], 
      ...data, 
      hydrationPoints,
      hydrationMultiplier: multiplier 
    };
    return { ...this.data[index] };

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(entry => entry.id === id);
    if (index === -1) throw new Error('Entry not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

async getTotalToday() {
    await delay(200);
    const todaysEntries = await this.getTodaysEntries();
    return todaysEntries.reduce((total, entry) => total + entry.amount, 0);
  }

  async getHydrationPointsToday() {
    await delay(200);
    const todaysEntries = await this.getTodaysEntries();
    return todaysEntries.reduce((total, entry) => total + (entry.hydrationPoints || entry.amount), 0);
  }

export default new WaterEntryService();