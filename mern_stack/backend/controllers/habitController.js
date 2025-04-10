const Habit = require('../models/habitModel')
const mongoose = require('mongoose')
const { calculateAndUpdateStreaks } = require('../utils/streakUtil');

/**
 * Retrieves all habits.
 *
 * This asynchronous function fetches all habit documents from the database,
 * sorting them in descending order based on the creation time (assumed to be stored in "createAt").
 * It then returns a JSON response with a 200 status code containing the list of habits.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getHabits = async (req, res) => {
    const habits = await Habit.find({}).sort({createAt: -1})
    res.status(200).json(habits)
}

/**
 * Retrieves a single habit by its ID.
 *
 * This asynchronous function extracts the habit ID from the request parameters,
 * validates whether it's a valid MongoDB ObjectId, and queries the database for the corresponding habit.
 * If the habit is found, it returns a JSON response with a 200 status code; otherwise, it responds with a 404 error.
 *
 * @param {Object} req - Express request object; expects req.params.id.
 * @param {Object} res - Express response object.
 */
const getHabit = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such habit'})
    }

    const habit = await Habit.findById(id)

    if (!habit) {
        return res.status(404).json({error: 'No such habit'})
    }

    res.status(200).json(habit)
}

/**
 * Creates a new habit.
 *
 * This asynchronous function extracts the title and description from the request body
 * and attempts to create a new habit document in the database.
 * On successful creation, it returns a JSON response with a 200 status code containing the new habit.
 * If an error occurs during creation, it returns a 404 error with the corresponding error message.
 *
 * @param {Object} req - Express request object; expects req.body with title and description.
 * @param {Object} res - Express response object.
 */
const createHabit = async (req, res) => {
    const {title, description} = req.body

    try {
        const habit = await Habit.create({title, description})
        res.status(200).json(habit)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

/**
 * Deletes a habit by its ID.
 *
 * This asynchronous function extracts the habit ID from the request parameters,
 * validates the ID, and then attempts to delete the corresponding habit document from the database.
 * If the deletion is successful, it returns a JSON response with a 200 status code containing the deleted habit.
 * If the habit is not found or the ID is invalid, it returns a 404 error with an appropriate message.
 *
 * @param {Object} req - Express request object; expects req.params.id.
 * @param {Object} res - Express response object.
 */
const deleteHabit = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such habit'})
    }

    const habit = await Habit.findOneAndDelete({_id: id})

    if (!habit) {
        return res.status(404).json({error: 'No such habit'})
    }

    res.status(200).json(habit)
} 

/**
 * Updates a habit by its ID.
 *
 * This asynchronous function extracts the habit ID from the request parameters,
 * validates the ID, and updates the corresponding habit document in the database with the data provided in the request body.
 * If the update is successful, it returns a JSON response with a 200 status code containing the updated habit.
 * If the habit is not found or the ID is invalid, it returns a 404 error with an appropriate message.
 *
 * @param {Object} req - Express request object; expects req.params.id and update data in req.body.
 * @param {Object} res - Express response object.
 */
const updateHabit = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such habit'})
    }

    const habit = await Habit.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!habit) {
        return res.status(404).json({error: 'No such habit'})
    }

    res.status(200).json(habit)
}
const completeHabit = async (req, res) => { 
	const { id } = req.params; 
	console.log('completeHabit called') 
    if (!mongoose.Types.ObjectId.isValid(id)) { 
		return res.status(404).json({ error: 'Invalid habit ID' }); 
	} 

	const habit = await Habit.findById(id); 
	if (!habit) { 
		return res.status(404).json({ error: 'Habit not found' }); 
	} 
	const today = new Date(); 
	const todayDateString = today.toDateString(); 

	const completionIndex = habit.completions.findIndex((entry) => { 
		const entryDate = new Date(entry.date).toDateString(); 
		return entryDate === todayDateString; 
	}); 
	
	if (completionIndex === -1) { 
	// If not completed today, add a new completion 
		habit.completions.push({ date: today, completed: true }); 
	} else { // If already completed today, remove the completion entry 
		habit.completions.splice(completionIndex, 1); 
	} 
	
	console.log('Completions before streak calculation:', habit.completions); 
	//habit.completions.push({ date: new Date(), completed: true }); 
	calculateAndUpdateStreaks(habit); 
	await habit.save(); 
	res.status(200).json(habit); 
};
/*const completeHabit = async (req, res, today = new Date()) => { 
	if (!(today instanceof Date) || isNaN(today.getTime())) {
    throw new Error('Invalid "today" parameter. Must be a valid Date object.');}
    const { id } = req.params; 
	console.log('completeHabit called') 
	if (!mongoose.Types.ObjectId.isValid(id)) { 
		return res.status(404).json({ error: 'Invalid habit ID' });
	} 
	
	const habit = await Habit.findById(id); 
	if (!habit) { 
		return res.status(404).json({ error: 'Habit not found' }); 
	} 

	const today = new Date(); 
	const todayDateString = today.toDateString(); 
	
	const completionIndex = habit.completions.findIndex((entry) => { 
		const entryDate = new Date(entry.date).toDateString(); 
		return entryDate === todayDateString; 
	}); 
	
	if (completionIndex === -1) { 
	// If not completed today, add a new completion 
		habit.completions.push({ date: today, completed: true }); 
	
	} else { // If already completed today, remove the completion entry 
		habit.completions.splice(completionIndex, 1); 
	} 
	
	console.log('Completions before streak calculation:', habit.completions); 
	//habit.completions.push({ date: new Date(), completed: true }); 
	calculateAndUpdateStreaks(habit); 
	await habit.save(); 
	res.status(200).json(habit); 
};*/
module.exports = {
    getHabits,
    getHabit,
    createHabit,
    deleteHabit,
    updateHabit,
    completeHabit
}
