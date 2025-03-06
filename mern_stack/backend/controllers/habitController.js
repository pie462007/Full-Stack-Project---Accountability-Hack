const Habit = require('../models/habitModel')
const mongoose = require('mongoose')

// get all habits
const getHabits = async (req, res) => {
    const habits = await Habit.find({}).sort({createAt: -1})

    res.status(200).json(habits)
}

// get a single habit
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

// create a new habit
const createHabit = async (req, res) => {
    const {title, description} = req.body

    // add doc to db
    try {
        const habit = await Habit.create({title, description})
        res.status(200).json(habit)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

// delete a habit
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

// update a habit
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

module.exports = {
    getHabits,
    getHabit,
    createHabit,
    deleteHabit,
    updateHabit
}