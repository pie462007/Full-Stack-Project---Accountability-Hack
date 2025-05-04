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
        type: Date
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
    user_id: {
        type: String,
        required: true
    },
    isPrivate: {
        type: Boolean,
        default: true
    },
    synced: {
        type: [
          {
            habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
          }
        ],
        validate: {
          validator: function (val) {
            return val.length <= 5;
          },
          message: 'You can sync with up to 5 habits/users.'
        }
      }
}, { timestamps: true })

module.exports = mongoose.model('Habit', habitSchema)