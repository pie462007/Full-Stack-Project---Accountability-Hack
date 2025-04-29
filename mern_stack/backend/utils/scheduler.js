const cron = require('node-cron');
const { calculateAndUpdateStreaks } = require('./streakUtil'); 
const Habit = require('../models/habitModel'); // Assuming Habit is your MongoDB model

// Daily habit streak check at 12:00 AM local time
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily habit streak update...');
    try {
        const habits = await Habit.find({ frequency: 'daily' });
        habits.forEach(habit => calculateAndUpdateStreaks(habit));
        console.log('Daily streaks updated.');
    } catch (error) {
        console.error('Error updating daily streaks:', error);
    }
});

// Weekly habit streak check (every Sunday at 12:00 AM local time)
cron.schedule('0 0 * * 0', async () => {
    console.log('Running weekly habit streak update...');
    try {
        const habits = await Habit.find({ frequency: 'weekly' });
        habits.forEach(habit => calculateAndUpdateStreaks(habit));
        console.log('Weekly streaks updated.');
    } catch (error) {
        console.error('Error updating weekly streaks:', error);
    }
});

// Monthly habit streak check (every 1st of the month at 12:00 AM local time)
cron.schedule('0 0 1 * *', async () => {
    console.log('Running monthly habit streak update...');
    try {
        const habits = await Habit.find({ frequency: 'monthly' });
        habits.forEach(habit => calculateAndUpdateStreaks(habit));
        console.log('Monthly streaks updated.');
    } catch (error) {
        console.error('Error updating monthly streaks:', error);
    }
});

console.log('Cron jobs scheduled');