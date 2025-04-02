const mongoose = require('mongoose')

const Schema = mongoose.Schema

const habitSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    completions: [{
        date: {
            type: Date,
            default: Date.now
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
    },
    goal: {
        type: Number,  // Target completions per period
        default: 1
    }

}, { timestamps: true })

module.exports = mongoose.model('Habit', habitSchema)