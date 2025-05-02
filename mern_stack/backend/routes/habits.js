const express = require('express')
const {
    createHabit,
    getHabits,
    getHabit,
    deleteHabit,
    updateHabit,
    completeHabit,
    syncHabit,
    getAllHabitsForLeaderboard
} = require('../controllers/habitController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

// Get all habits and leaderboard route must come before /:id routes
router.get('/', getHabits)
router.get('/leaderboard', getAllHabitsForLeaderboard)

// Routes with :id parameter
router.get('/:id', getHabit)
router.post('/', createHabit)
router.post('/sync', syncHabit)
router.delete('/:id', deleteHabit)
router.patch('/:id', updateHabit)
router.patch('/:id/complete', completeHabit)

module.exports = router