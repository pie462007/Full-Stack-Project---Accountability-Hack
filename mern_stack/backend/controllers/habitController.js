const Habit = require('../models/habitModel')
const mongoose = require('mongoose')
const { calculateAndUpdateStreaks } = require('../utils/streakUtil');


const getHabits = async (req, res) => {
	const user_id = req.user._id
    const habits = await Habit.find({user_id}).sort({createAt: -1})
    res.status(200).json(habits)
}


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


const createHabit = async (req, res) => {
    const {title, description} = req.body

    try {
		const user_id = req.user._id
        const habit = await Habit.create({title, description, user_id})
        res.status(200).json(habit)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

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
	today.setHours(0, 0, 0, 0); // Normalize to start of day

	// Check if habit is already completed for today
	const isCompletedToday = habit.completions.some(completion => {
		if (!completion) return false;
		const completionDate = new Date(completion);
		completionDate.setHours(0, 0, 0, 0);
		return completionDate.getTime() === today.getTime();
	});

	if (isCompletedToday) {
		// If already completed today, remove the completion
		habit.completions = habit.completions.filter(completion => {
			if (!completion) return false;
			const completionDate = new Date(completion);
			completionDate.setHours(0, 0, 0, 0);
			return completionDate.getTime() !== today.getTime();
		});
	} else {
		// If not completed today, add completion
		habit.completions.push(today.toISOString());
	}

	// Calculate and update streaks
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
