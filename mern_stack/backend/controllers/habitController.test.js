const { createHabit } = require('./habitController'); 
const Habit = require('../models/habitModel');
jest.mock('../models/habitModel');

describe('Habit Controller Tests', () => {
    let req, res;
    beforeEach(() => {
        req = { body: { title: 'Exercise', description: 'Workout every morning' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('should create a habit and return 200 with the habit object', async () => {
            const mockHabit = { id: '123', title: 'Exercise', description: 'Workout every morning' };
            Habit.create.mockResolvedValue(mockHabit);

            await createHabit(req, res);

            expect(Habit.create).toHaveBeenCalledWith({ title: 'Exercise', description: 'Workout every morning' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockHabit);
    });

    test('should return 404 and an error message if creation fails', async () => {
        const errorMessage = 'Database error';
        Habit.create.mockRejectedValue(new Error(errorMessage));

        await createHabit(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});