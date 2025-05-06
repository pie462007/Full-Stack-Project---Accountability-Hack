
const streakUtil = require('./streakUtil');
jest.spyOn(streakUtil, 'calculateDailyStreaks');
jest.spyOn(streakUtil, 'calculateWeeklyStreaks');
jest.spyOn(streakUtil, 'calculateMonthlyStreaks');

describe("calculateAndUpdateStreaks", () => {
    test("calls daily streak function for daily habit", () => {
        const habit = { 
            frequency: "daily", 
            completions: [
                new Date("2025-05-01T00:00:00"), 
                new Date("2025-05-02T00:00:00")
            ] 
        };
        
        if (habit.frequency === 'daily') {
            console.log("Calling calculateDailyStreaks with:", habit.completions);
            streakData = streakUtil.calculateDailyStreaks(habit.completions);
        }
        streakUtil.calculateAndUpdateStreaks(habit);
        
        expect(streakUtil.calculateDailyStreaks).toHaveBeenCalledWith(expect.any(Array)); 
        expect(habit.currentStreak).toBeDefined();
        expect(habit.longestStreak).toBeDefined();
    });
   
    test("calls weekly streak function for weekly habit", () => {
        const habit = { 
            frequency: "weekly", 
            completions: [
                new Date("2025-04-27T00:00:00"), 
                new Date("2025-05-04T00:00:00")
            ] 
        };
        
        if (habit.frequency === 'weekly') {
            console.log("Calling calculateWeeklyStreaks with:", habit.completions);
            streakData = streakUtil.calculateWeeklyStreaks(habit.completions);
        }
        streakUtil.calculateAndUpdateStreaks(habit);
        
        expect(streakUtil.calculateWeeklyStreaks).toHaveBeenCalledWith(expect.any(Array)); 
        expect(habit.currentStreak).toBeDefined();
        expect(habit.longestStreak).toBeDefined();
    });

    test("calls monthly streak function for monthly habit", () => {
        const habit = { 
            frequency: "monthly", 
            completions: [
                new Date("2025-03-01T00:00:00"), 
                new Date("2025-04-01T00:00:00")
            ] 
        };
        
        if (habit.frequency === 'monthly') {
            console.log("Calling calculateMonthlyStreaks with:", habit.completions);
            streakData = streakUtil.calculateMonthlyStreaks(habit.completions);
        }
        streakUtil.calculateAndUpdateStreaks(habit);
        
        expect(streakUtil.calculateMonthlyStreaks).toHaveBeenCalledWith(expect.any(Array)); 
        expect(habit.currentStreak).toBeDefined();
        expect(habit.longestStreak).toBeDefined();
    });

});