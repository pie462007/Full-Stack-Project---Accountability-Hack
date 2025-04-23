const calculateDailyStreaks = (completions) => {
    //console.log("IN DAILY");
    let currentStreak = 0;
    let longestStreak = 0;

    if (completions.length === 0) {
        console.log("returning completion = 0");
        return { currentStreak, longestStreak }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const lastCompletionDate = completions[completions.length - 1];

    if (completions.length === 1) {
        longestStreak = 1;
        if (lastCompletionDate.getTime() === today.getTime() || lastCompletionDate.getTime() === yesterday.getTime()) {
            currentStreak = 1;
        } 
        console.log("returning completion = 1");
        return { currentStreak, longestStreak }
    };

    currentStreak = 1;
    for (let i = 1; i < completions.length; i++) {
        //console.log("Top of loop:");
        //console.log(currentStreak);
        const prevDate = completions[i - 1];
        const currDate = completions[i];
        const differenceInDays = (currDate - prevDate) / 86400000; // Convert to full days

        if (differenceInDays === 1) {
            //console.log("increment streak");
            longestStreak = Math.max(longestStreak, currentStreak);
            currentStreak++;
        } else {
            //console.log("streak reset to 1");
            longestStreak = Math.max(longestStreak, currentStreak);
            currentStreak = 1; 
        }
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    console.log("Last Completion:");
    console.log(lastCompletionDate);
    
    console.log("Today:");
    console.log(today);
    if (lastCompletionDate.getTime() !== today.getTime() && lastCompletionDate.getTime() !== yesterday.getTime()) {
        currentStreak = 0;
    } 

    return { currentStreak, longestStreak };
};

const calculateWeeklyStreaks = (completions) => {
    console.log("IN WEEKLY");
    let currentStreak = 0;
    let longestStreak = 0;

    if (completions.length === 0) {
        console.log("returning completion = 0");
        return { currentStreak, longestStreak };
    }

    // Normalize today to local time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getWeekBoundary = (date) => {
        const d = new Date(date); 
        d.setUTCHours(0, 0, 0, 0); // Normalize to UTC midnight
        const dayOfWeek = d.getUTCDay(); // Get UTC day of the week (0 = Sunday, 6 = Saturday)
        
        if (dayOfWeek === 0) {
            return d.getTime();
        } else {
            // Adjust backward to the previous Sunday in UTC
            d.setUTCDate(d.getUTCDate() - dayOfWeek);
            return d.getTime();
        }
    };

    const lastCompletionDate = completions[completions.length - 1];
    const lastWeekBoundary = getWeekBoundary(lastCompletionDate);
    const todayBoundary = getWeekBoundary(today);

    // Handle single entry case
    if (completions.length === 1) {
        longestStreak = 1;
        if (lastWeekBoundary === todayBoundary) {
            currentStreak = 1; // Same week
        } else if (lastWeekBoundary === todayBoundary - 7 * 86400000) {
            currentStreak = 1; // Consecutive weeks
        } 
        console.log("returning completion = 1");
        return { currentStreak, longestStreak };
    }

    // Loop through completions 
    currentStreak = 1;
    for (let i = 1; i < completions.length; i++) {
        const prevBoundary = getWeekBoundary(completions[i - 1]);
        const currBoundary = getWeekBoundary(completions[i]);
        console.log("Prev Boundary: ", prevBoundary);
        console.log("Curr Boundary: ", currBoundary);

        // Check for consecutive weeks
        if (currBoundary === prevBoundary + 7 * 86400000) { // Consecutive week
            currentStreak++;
        } else {
            longestStreak = Math.max(longestStreak, currentStreak); // Update longest streak
            currentStreak = 1; // Reset streak
        }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    console.log("Last Completion:", lastCompletionDate);
    console.log("Today:", today);

    if (lastWeekBoundary !== todayBoundary && lastWeekBoundary !== todayBoundary - 7 * 86400000) {
        currentStreak = 0; // Reset streak if the last completion is not recent
    }

    return { currentStreak, longestStreak };
};


const calculateMonthlyStreaks = (completions) => {
    //console.log("IN MONTHLY");
    let currentStreak = 0;
    let longestStreak = 0;

    if (completions.length === 0) {
        console.log("returning completion = 0");
        return { currentStreak, longestStreak };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompletionDate = new Date(completions[completions.length - 1]); 

    if (completions.length === 1) {
        longestStreak = 1; 
        //const singleCompletionDate = new Date(completions[0]);
        if ((lastCompletionDate.getFullYear() === today.getFullYear() && 
            lastCompletionDate.getMonth() === today.getMonth()) ||
            (lastCompletionDate.getFullYear() === today.getFullYear() && 
            lastCompletionDate.getMonth() === today.getMonth() - 1) || 
            (lastCompletionDate.getFullYear() === today.getFullYear() - 1 &&
            lastCompletionDate.getMonth() === 11 && today.getMonth() === 0)){
            currentStreak = 1; 
        }
        console.log("returning completion = 1");
        return { currentStreak, longestStreak };
    }

    currentStreak = 1;
    for (let i = 1; i < completions.length; i++) {
        const prevDate = new Date(completions[i - 1]);
        const currDate = new Date(completions[i]);

        const prevYear = prevDate.getFullYear();
        const prevMonth = prevDate.getMonth();
        const currYear = currDate.getFullYear();
        const currMonth = currDate.getMonth();

        if (currYear === prevYear && currMonth === prevMonth) {
            continue; 
        }

        if ((currYear === prevYear && currMonth === prevMonth + 1) || 
            (currYear === prevYear + 1 && currMonth === 0 && prevMonth === 11)) {
            currentStreak++;

        } else {
            longestStreak = Math.max(longestStreak, currentStreak);
            currentStreak = 1; 
        }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    if (!(lastCompletionDate.getFullYear() === today.getFullYear() && lastCompletionDate.getMonth() === today.getMonth()) && // Same month
        !(lastCompletionDate.getFullYear() === today.getFullYear() && lastCompletionDate.getMonth() === today.getMonth() - 1) && // Previous month
        !(lastCompletionDate.getFullYear() === today.getFullYear() - 1 && lastCompletionDate.getMonth() === 11 && today.getMonth() === 0) // December → January
    ) {
        currentStreak = 0; // Reset streak if last completion is outside valid timeframe
    }

    console.log("Last Completion:", lastCompletionDate);
    console.log("Today:", today);

    return {currentStreak, longestStreak};
};

const calculateAndUpdateStreaks = (habit) => {
    // Sort habit completions by date
    const completions = habit.completions
        .map(date => new Date(date)) // Ensure every date is a Date object
        .sort((a, b) => a - b); // Sort in chronological order

    let streakData = { currentStreak: 0, longestStreak: 0 };

    if (habit.frequency === 'daily') {
        streakData = calculateDailyStreaks(completions);
    } else if (habit.frequency === 'weekly') {
        streakData = calculateWeeklyStreaks(completions);
    } else if (habit.frequency === 'monthly') {
        streakData = calculateMonthlyStreaks(completions);
    }

    habit.currentStreak = streakData.currentStreak;
    habit.longestStreak = streakData.longestStreak;

    console.log('Current Streak:', habit.currentStreak);
    console.log('Longest Streak:', habit.longestStreak);
};

module.exports = {calculateAndUpdateStreaks, calculateDailyStreaks, calculateWeeklyStreaks, calculateMonthlyStreaks};