const express = require('express')
const {
    createHabit,
    getHabits,
    getHabit,
    deleteHabit,
    updateHabit,
    completeHabit,
    syncHabit
} = require('../controllers/habitController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)
router.get('/', getHabits)
router.get('/:id', getHabit)
router.post('/', createHabit)
router.post('/sync', syncHabit)
router.delete('/:id', deleteHabit)
router.patch('/:id', updateHabit)
router.patch('/:id/complete', completeHabit);

module.exports = router