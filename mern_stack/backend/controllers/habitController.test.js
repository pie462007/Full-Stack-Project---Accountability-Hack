const { getHabits } = require('./habitController'); //still need to implement
const { getHabit } = require('./habitController'); //tester created
const { createHabit } = require('./habitController'); //tester created
const { deleteHabit } = require('./habitController'); //tester created
const { updateHabit } = require('./habitController'); //tester created
const { completeHabit } = require('./habitController');
const Habit = require('../models/habitModel');
jest.mock('../models/habitModel');

describe('Habit Controller Tests', () => { //description of the testers that will be ran.
    let req, res;
    beforeEach(() => {
        req = { body: { title: 'Exercise', description: 'Workout every morning' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    //Tests for createHabit
    test('should create a habit and return 200 with the habit object', async () => { //test for createHabit()
            const mockHabit = { id: '123', title: 'Exercise', description: 'Workout every morning' };
            Habit.create.mockResolvedValue(mockHabit);

            await createHabit(req, res);

            expect(Habit.create).toHaveBeenCalledWith({ title: 'Exercise', description: 'Workout every morning' }); //expect the given habit to be created.
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockHabit);
    });
    test('should return 404 and an error message if creation fails', async () => { //test for createHabit()
        const errorMessage = 'Database error';
        Habit.create.mockRejectedValue(new Error(errorMessage));

        await createHabit(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });


    //Tests for getHabit
    test('should return 404 if the ID is invalid', async () => { //test for getHabit()
        const req = { params: {} };
        req.params.id = 'invalid-id'; // Invalid ObjectId

        await getHabit(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'No such habit' });
    });
    test('should return 200 and the habit if found', async () => {
        req = { params: { id: '603d2149e17d3e2f50a49b80' } }; // Valid ObjectId
        const mockHabit = { id: '603d2149e17d3e2f50a49b80', title: 'Exercise', description: 'Workout every morning' };
        Habit.findById.mockResolvedValue(mockHabit);
    
        await getHabit(req, res);
    
        expect(Habit.findById).toHaveBeenCalledWith('603d2149e17d3e2f50a49b80');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockHabit);
    });
    test('should return 404 if the habit does not exist', async () => {
        req = { params: { id: '603d2149e17d3e2f50a49b80' } }; // Valid ObjectId
        Habit.findById.mockResolvedValue(null); // Simulate habit not found
    
        await getHabit(req, res);
    
        expect(Habit.findById).toHaveBeenCalledWith('603d2149e17d3e2f50a49b80');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'No such habit' });
    });


    //Tests for deleteHabit
    test('should return 200 and the deleted habit if found', async () => { //test for deleteHabit()
        req = { params: { id: '603d2149e17d3e2f50a49b80' } }; //tester param for delete habit.
        const mockHabit = { id: '603d2149e17d3e2f50a49b80', title: 'Exercise', description: 'Workout every morning' };
        Habit.findOneAndDelete.mockResolvedValue(mockHabit);

        await deleteHabit(req, res);

        expect(Habit.findOneAndDelete).toHaveBeenCalledWith({ _id: '603d2149e17d3e2f50a49b80' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockHabit);
    });
    test('should return 404 if the id is not a valid ObjectId', async () => {
        // Test case where the ID is not valid
        req = { params: { id: 'invalid-id' } };
        //req.params.id = 'invalid-id';

        await deleteHabit(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'No such habit' });
    });
    test('should return 404 if the habit is not found in the database', async () => {
        // Test case where the habit does not exist
        req = { params: { id: '60c72b2f9b1d8c001f8e4d4b' } };
        //req.params.id = '60c72b2f9b1d8c001f8e4d4b'; // An example of an ID that doesn't exist

        // Mock the Habit.findOneAndDelete method to return null (habit not found)
        Habit.findOneAndDelete = jest.fn().mockResolvedValue(null);

        await deleteHabit(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'No such habit' });
    });

    //Tests for updateHabit
    test('should return 200 and the updated habit if found', async () => { //test for updateHabit().
        req = { params: { id: '603d2149e17d3e2f50a49b80' } };
        const mockHabit = { id: '603d2149e17d3e2f50a49b80', title: 'Updated Title', description: 'Updated Description' };
        Habit.findOneAndUpdate.mockResolvedValue(mockHabit);

        await updateHabit(req, res);

        expect(Habit.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '603d2149e17d3e2f50a49b80' }, 
            { ...req.body }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockHabit);
    });
    test('should return 200 and the updated habit if found', async () => { //test for updateHabit().
        req = { params: { id: '603d2149e17d3e2f50a49b80' , title: 'Old Title', description: 'Old Description' } };
        const mockHabit = { id: '603d2149e17d3e2f50a49b80', title: 'Updated Title', description: 'Updated Description' };
        Habit.findOneAndUpdate.mockResolvedValue(mockHabit);

        await updateHabit(req, res);

        expect(Habit.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '603d2149e17d3e2f50a49b80' }, 
            { ...req.body }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockHabit);
    });
    test('should return 200 and the updated habit if found', async () => { //test for updateHabit().
        req = { params: { id: '603d2149e17d3e2f50a49b80' , title: 'Old Title'} };
        const mockHabit = { id: '603d2149e17d3e2f50a49b80', title: 'Updated Title', description: 'Updated Description' };
        Habit.findOneAndUpdate.mockResolvedValue(mockHabit);

        await updateHabit(req, res);

        expect(Habit.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '603d2149e17d3e2f50a49b80' }, 
            { ...req.body }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockHabit);
    });
    test('should return 200 and the updated habit if found', async () => { //test for updateHabit().
        req = { params: { id: '603d2149e17d3e2f50a49b80' , description: 'Old Description' } };
        const mockHabit = { id: '603d2149e17d3e2f50a49b80', title: 'Updated Title', description: 'Updated Description' };
        Habit.findOneAndUpdate.mockResolvedValue(mockHabit);

        await updateHabit(req, res);

        expect(Habit.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '603d2149e17d3e2f50a49b80' }, 
            { ...req.body }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockHabit);
    });
    test('should return 404 if habit is not found in the database', async () => { //test for updateHabit().
        req = { params: { id: '603d2149e17d3e2f50a49b80' , title: 'Old Title', description: 'Old Description' } };
        Habit.findOneAndUpdate.mockResolvedValue(null);

        await updateHabit(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'No such habit' });
    });

    //Tests for completeHabit (more testing needed) 
    //Cannot figure these out, will come back to them at a later point
    /*test('Adding a completion for today updates streaks correctly', async () => {
        //jest.spyOn(global, 'Date').mockImplementation(() => new Date('2025-04-08'));
        const habit = {
            completions: [
                { date: new Date('2025-04-06'), completed: true },
                { date: new Date('2025-04-07'), completed: true }
            ],
            save: jest.fn() // Mock save function
        };
        const req = { params: { id: 'validId' } };
        const res = {
            status: jest.fn(() => ({
                json: jest.fn()
            }))
        };

        const fixedDate = new Date('2025-04-08');
        await completeHabit(req, res, fixedDate);

        // Check that today's completion was added
        //expect(habit.completions.some(entry => new Date(entry.date).toDateString() === today.toDateString())).toBe(true);
        console.log('Matching Date:', fixedDate.toDateString());
        console.log('Matching Dates:', fixedDate)
        console.log('Existing Dates:', habit.completions.map(entry => new Date(entry.date).toDateString()));
        console.log('\n\nFixed Date (Mocked Today):', fixedDate.toISOString()); // Log fixed mocked "today" in UTC
        console.log('Existing Dates (UTC):', habit.completions.map(entry => new Date(entry.date).toISOString()));

        //const todayUTC = fixedDate.toISOString().split('T')[0]; // Extract just the UTC date part (YYYY-MM-DD)
        //const completionDatesUTC = habit.completions.map(entry => new Date(entry.date).toISOString().split('T')[0]);
        //expect(completionDatesUTC).toContain(todayUTC); // Check if today's date exists in the completions

        //expect(habit.completions.length).toBe(3); // Includes today's completion
        console.log('Curr Streak', habit.currentStreak)
        expect(habit.currentStreak).toBe(3);
        expect(habit.longestStreak).toBe(3);
        //jest.restoreAllMocks();
    });

    
    test('Removing today\'s completion updates streaks correctly', async () => {
        const today = new Date();
        const habit = {
            completions: [
                { date: new Date('2025-04-01'), completed: true },
                { date: today, completed: true }
            ],
            save: jest.fn() // Mock save function
        };
        const req = { params: { id: 'validId' } };
        const res = {
            status: jest.fn(() => ({
                json: jest.fn()
            }))
        };

        await completeHabit(req, res);

        // Check that today's completion was removed
        expect(habit.completions.some(entry => new Date(entry.date).toDateString() === today.toDateString())).toBe(false);
        expect(habit.completions.length).toBe(1); // Today's completion removed
        expect(habit.currentStreak).toBe(1);
        expect(habit.longestStreak).toBe(1);
    });*/
        
});