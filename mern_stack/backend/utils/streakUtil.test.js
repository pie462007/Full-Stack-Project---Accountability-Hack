const { calculateDailyStreaks } = require('./streakUtil');
const { calculateWeeklyStreaks } = require('./streakUtil');
const { calculateMonthlyStreaks } = require('./streakUtil');

//----- CalculateDailyStreaks-----
describe("calculateDailyStreaks", () => {
    test("returns 0 streaks for empty completions", () => {
        expect(calculateDailyStreaks([])).toEqual({ currentStreak: 0, longestStreak: 0 });
    });

    test("returns 1 current streak for single completion today", () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expect(calculateDailyStreaks([today])).toEqual({ currentStreak: 1, longestStreak: 1 });
    });

    test("returns 1 current streak for single completion yesterday", () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        expect(calculateDailyStreaks([yesterday])).toEqual({ currentStreak: 1, longestStreak: 1 });
    });

    test("returns 0 current streak for single completion older than yesterday", () => {
        const threeDaysAgo = new Date();
        threeDaysAgo.setHours(0, 0, 0, 0);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        expect(calculateDailyStreaks([threeDaysAgo])).toEqual({ currentStreak: 0, longestStreak: 1 });
    });

    test("returns correct streak for multiple consecutive completions", () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);
        expect(calculateDailyStreaks([twoDaysAgo, yesterday, today])).toEqual({ currentStreak: 3, longestStreak: 3 });
    });

    test("returns correct streak when a gap occurs", () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);
        expect(calculateDailyStreaks([twoDaysAgo, today])).toEqual({ currentStreak: 1, longestStreak: 1 });
    });

    test("resets current streak when last completion is too far back", () => {
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setHours(0, 0, 0, 0);
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        const threeDaysAgo = new Date();
        threeDaysAgo.setHours(0, 0, 0, 0);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        expect(calculateDailyStreaks([fiveDaysAgo, threeDaysAgo])).toEqual({ currentStreak: 0, longestStreak: 1 });
    });
});


//-----Calculate Weekly Streaks-----
describe("calculateWeeklyStreaks", () => {
    const getSunday = (date) => {
        const d = new Date(date);
        d.setDate(d.getDate() - d.getDay()); // Adjust to previous Sunday
        d.setHours(0, 0, 0, 0);
        return d;
    };

    test("returns 0 streaks for empty completions", () => {
        expect(calculateWeeklyStreaks([])).toEqual({ currentStreak: 0, longestStreak: 0 });
    });

    test("returns 1 current streak for single completion in the current week", () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expect(calculateWeeklyStreaks([today])).toEqual({ currentStreak: 1, longestStreak: 1 });
    });

    test("returns 1 current streak for single completion in the previous week", () => {
        const lastSunday = getSunday(new Date());
        lastSunday.setDate(lastSunday.getDate() - 7); // Move back one week
        expect(calculateWeeklyStreaks([lastSunday])).toEqual({ currentStreak: 1, longestStreak: 1 });
    });

    test("returns 0 current streak for single completion older than last week", () => {
        const twoWeeksAgo = getSunday(new Date());
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14); // Two weeks ago
        expect(calculateWeeklyStreaks([twoWeeksAgo])).toEqual({ currentStreak: 0, longestStreak: 1 });
    });

    test("returns correct streak for multiple consecutive weekly completions", () => {
        const sunday1 = getSunday(new Date());
        sunday1.setDate(sunday1.getDate() - 7);

        const sunday2 = getSunday(new Date());
        sunday2.setDate(sunday2.getDate() - 14);

        expect(calculateWeeklyStreaks([sunday2, sunday1, new Date()])).toEqual({ currentStreak: 3, longestStreak: 3 });
    });

    test("returns correct streak when a gap occurs", () => {
        const sunday1 = getSunday(new Date());
        sunday1.setDate(sunday1.getDate() - 7);

        const sunday3 = getSunday(new Date());
        sunday3.setDate(sunday3.getDate() - 21); // Skip one week

        expect(calculateWeeklyStreaks([sunday3, sunday1, new Date()])).toEqual({ currentStreak: 2, longestStreak: 2 });
    });

    test("resets current streak when last completion is too far back", () => {
        const threeWeeksAgo = getSunday(new Date());
        threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

        const fourWeeksAgo = getSunday(new Date());
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        expect(calculateWeeklyStreaks([fourWeeksAgo, threeWeeksAgo])).toEqual({ currentStreak: 0, longestStreak: 2 });
    });
});


//-----Calculate Monthly Streak-----
describe("calculateMonthlyStreaks", () => {
    const getFirstOfMonth = (date) => {
        const d = new Date(date);
        d.setDate(1); // Set to the first day of the month
        d.setHours(0, 0, 0, 0);
        return d;
    };

    test("returns 0 streaks for empty completions", () => {
        expect(calculateMonthlyStreaks([])).toEqual({ currentStreak: 0, longestStreak: 0 });
    });

    test("returns 1 current streak for single completion in the current month", () => {
        const thisMonth = getFirstOfMonth(new Date());
        expect(calculateMonthlyStreaks([thisMonth])).toEqual({ currentStreak: 1, longestStreak: 1 });
    });

    test("returns 1 current streak for single completion in the previous month", () => {
        const lastMonth = getFirstOfMonth(new Date());
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        expect(calculateMonthlyStreaks([lastMonth])).toEqual({ currentStreak: 1, longestStreak: 1 });
    });

    test("ensures longest streak is 2 when completing in December and January", () => {
        const december = new Date();
        december.setFullYear(new Date().getFullYear() - 1); 
        december.setMonth(11); 
        december.setDate(1); 
    
        const january = new Date();
        january.setFullYear(new Date().getFullYear()); 
        january.setMonth(0); 
        january.setDate(1);     

        const expectedCurrentStreak = new Date().getMonth() === 0 ? 2 : 0; // If running in January, expect 2, otherwise 0
        expect(calculateMonthlyStreaks([december, january])).toEqual({ currentStreak: 0, longestStreak: 2 });
    });

    test("returns 0 current streak for single completion older than the previous month", () => {
        const threeMonthsAgo = getFirstOfMonth(new Date());
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        expect(calculateMonthlyStreaks([threeMonthsAgo])).toEqual({ currentStreak: 0, longestStreak: 1 });
    });

    test("returns correct streak for multiple consecutive monthly completions", () => {
        const oneMonthAgo = getFirstOfMonth(new Date());
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const twoMonthsAgo = getFirstOfMonth(new Date());
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        expect(calculateMonthlyStreaks([twoMonthsAgo, oneMonthAgo, new Date()])).toEqual({ currentStreak: 3, longestStreak: 3 });
    });

    test("skips entries in the same month", () => {
        const oneMonthAgo = getFirstOfMonth(new Date());
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const twoMonthsAgo1 = getFirstOfMonth(new Date());
        twoMonthsAgo1.setMonth(twoMonthsAgo1.getMonth() - 2);

        const twoMonthsAgo2 = getFirstOfMonth(new Date());
        twoMonthsAgo2.setMonth(twoMonthsAgo2.getMonth() - 2);

        expect(calculateMonthlyStreaks([twoMonthsAgo2, twoMonthsAgo1, oneMonthAgo, new Date()])).toEqual({ currentStreak: 3, longestStreak: 3 });
        
    });


    test("returns correct streak when a gap occurs", () => {
        const oneMonthAgo = getFirstOfMonth(new Date());
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const threeMonthsAgo = getFirstOfMonth(new Date());
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3); 

        expect(calculateMonthlyStreaks([threeMonthsAgo, oneMonthAgo])).toEqual({ currentStreak: 1, longestStreak: 1 });
    });

    test("resets current streak when last completion is too far back", () => {
        const fiveMonthsAgo = getFirstOfMonth(new Date());
        fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

        const sixMonthsAgo = getFirstOfMonth(new Date());
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        expect(calculateMonthlyStreaks([sixMonthsAgo, fiveMonthsAgo])).toEqual({ currentStreak: 0, longestStreak: 2 });
    });
});


