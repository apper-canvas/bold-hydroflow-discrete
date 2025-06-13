import userStats from '@/services/mockData/userStats.json';
import waterEntryService from './waterEntryService.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserStatsService {
  constructor() {
    this.data = { ...userStats };
  }

  async getStats() {
    await delay(250);
    return { ...this.data };
  }

  async updateStats() {
    await delay(300);
    const allEntries = await waterEntryService.getAll();
    
    // Calculate total intake
    const totalIntake = allEntries.reduce((sum, entry) => sum + entry.amount, 0);
    
    // Calculate average daily intake (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEntries = allEntries.filter(entry => 
      new Date(entry.timestamp) >= thirtyDaysAgo
    );
    
    const dailyTotals = {};
    recentEntries.forEach(entry => {
      const date = new Date(entry.timestamp).toDateString();
      dailyTotals[date] = (dailyTotals[date] || 0) + entry.amount;
    });
    
    const averageDaily = Object.keys(dailyTotals).length > 0 
      ? Object.values(dailyTotals).reduce((sum, total) => sum + total, 0) / Object.keys(dailyTotals).length
      : 0;

    // Calculate current streak
    const currentStreak = await this.calculateCurrentStreak(allEntries);
    
    this.data = {
      ...this.data,
      totalIntake,
      averageDaily: Math.round(averageDaily),
      currentStreak,
      longestStreak: Math.max(this.data.longestStreak, currentStreak)
    };

    return { ...this.data };
  }

  async calculateCurrentStreak(entries = null) {
    await delay(200);
    if (!entries) {
      entries = await waterEntryService.getAll();
    }

    const dailyGoalService = await import('./dailyGoalService.js');
    const currentGoal = await dailyGoalService.default.getCurrentGoal();
    const goalAmount = currentGoal.targetAmount;

    // Group entries by date
    const dailyTotals = {};
    entries.forEach(entry => {
      const date = new Date(entry.timestamp).toDateString();
      dailyTotals[date] = (dailyTotals[date] || 0) + entry.amount;
    });

    // Calculate streak from today backwards
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) { // Max check 1 year
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toDateString();
      
      const dailyTotal = dailyTotals[dateString] || 0;
      
      if (dailyTotal >= goalAmount) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  async resetStats() {
    await delay(200);
    this.data = {
      currentStreak: 0,
      longestStreak: 0,
      totalIntake: 0,
      averageDaily: 0
    };
    return { ...this.data };
  }
}

export default new UserStatsService();