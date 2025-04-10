const express = require('express')
const {
    createHabit,
    getHabits,
    getHabit,
    deleteHabit,
    updateHabit,
    completeHabit
} = require('../controllers/habitController')

const router = express.Router()

// get all habits
router.get('/', getHabits)

// GET a single habit
router.get('/:id', getHabit)

// POST a new habit
router.post('/', createHabit)

// DELETE a habit
router.delete('/:id', deleteHabit)

// UPDATE a habit
router.patch('/:id', updateHabit)

// COMPLETE a habit
router.patch('/:id/complete', completeHabit);

module.exports = router