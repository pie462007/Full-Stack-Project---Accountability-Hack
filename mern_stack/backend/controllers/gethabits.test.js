const mongoose = require('mongoose');
const { getHabit } = require('./habitController'); // Adjust the path if necessary
const Habit = require('../models/habitModel');          // Adjust the path if necessary

jest.mock('../models/habitModel');; // Mock the Habit model to avoid actual DB calls

describe('getHabit', () => {
  let req, res;

  beforeEach(() => {
    // Set up default values for req and res for each test
    req = { params: { id: '603d2149e17d3e2f50a49b80' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('should return 404 if the provided id is not a valid ObjectId', async () => {
    req.params.id = 'invalid-id'; // Simulate an invalid ID

    await getHabit(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'No such habit' });
  });

  test('should return 404 if no habit is found with the given valid id', async () => {
    Habit.findById.mockResolvedValue(null); // Simulate no habit found

    await getHabit(req, res);

    expect(Habit.findById).toHaveBeenCalledWith('603d2149e17d3e2f50a49b80');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'No such habit' });
  });

  test('should return 200 and the habit if found', async () => {
    const mockHabit = {
      _id: '603d2149e17d3e2f50a49b80',
      title: 'Test Habit',
      description: 'Test Description'
    };
    Habit.findById.mockResolvedValue(mockHabit); // Simulate habit found

    await getHabit(req, res);

    expect(Habit.findById).toHaveBeenCalledWith('603d2149e17d3e2f50a49b80');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockHabit);
  });
});
