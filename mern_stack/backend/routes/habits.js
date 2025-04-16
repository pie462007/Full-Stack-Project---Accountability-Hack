const express = require('express')
const {
    createHabit,
    getHabits,
    getHabit,
    deleteHabit,
    updateHabit,
    completeHabit
} = require('../controllers/habitController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

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