const { createHabit } = require('./habitController');
const { getHabits } = require('./habitController'); 
const { getHabit } = require('./habitController'); 
const { deleteHabit } = require('./habitController'); 
const { updateHabit } = require('./habitController'); 
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

    test('should return 404 if the ID is invalid', async () => { //test for getHabit()
        const req = { params: {} };
        req.params.id = 'invalid-id'; // Invalid ObjectId

        await getHabit(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'No such habit' });
    });

    test('should return 200 and the deleted habit if found', async () => { //test for deleteHabit()
        req = { params: { id: '603d2149e17d3e2f50a49b80' } }; //tester param for delete habit.
        const mockHabit = { id: '603d2149e17d3e2f50a49b80', title: 'Exercise', description: 'Workout every morning' };
        Habit.findOneAndDelete.mockResolvedValue(mockHabit);

        await deleteHabit(req, res);

        expect(Habit.findOneAndDelete).toHaveBeenCalledWith({ _id: '603d2149e17d3e2f50a49b80' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockHabit);
    });

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
});