import dailyGoals from '@/services/mockData/dailyGoals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DailyGoalService {
  constructor() {
    this.data = [...dailyGoals];
  }

  async getAll() {
    await delay(250);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(goal => goal.id === id);
    return item ? { ...item } : null;
  }

  async getTodaysGoal() {
    await delay(200);
    const today = new Date().toDateString();
    const todaysGoal = this.data.find(goal => 
      new Date(goal.date).toDateString() === today
    );
    return todaysGoal ? { ...todaysGoal } : null;
  }

  async getCurrentGoal() {
    await delay(200);
    // Get the most recent goal or default to 64oz
    const sortedGoals = this.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    return sortedGoals.length > 0 ? { ...sortedGoals[0] } : {
      id: 'default',
      date: new Date().toISOString(),
      targetAmount: 64,
      unit: 'oz'
    };
  }

  async create(item) {
    await delay(300);
    const newGoal = {
      ...item,
      id: Date.now().toString(),
      date: item.date || new Date().toISOString()
    };
    this.data.push(newGoal);
    return { ...newGoal };
  }

  async update(id, data) {
    await delay(300);
    const index = this.data.findIndex(goal => goal.id === id);
    if (index === -1) throw new Error('Goal not found');
    
    this.data[index] = { ...this.data[index], ...data };
    return { ...this.data[index] };
  }

  async updateCurrentGoal(targetAmount, unit = 'oz') {
    await delay(300);
    const today = new Date().toDateString();
    const existingGoal = this.data.find(goal => 
      new Date(goal.date).toDateString() === today
    );

    if (existingGoal) {
      return this.update(existingGoal.id, { targetAmount, unit });
    } else {
      return this.create({
        date: new Date().toISOString(),
        targetAmount,
        unit
      });
    }
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(goal => goal.id === id);
    if (index === -1) throw new Error('Goal not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new DailyGoalService();