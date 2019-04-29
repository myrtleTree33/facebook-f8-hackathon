import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import logger from '../logger';

let mongooseHidden = require('mongoose-hidden')();

const { Schema } = mongoose;

const answerSchema = new Schema({
  questionId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
    select: false
  }
});

// This will add `id` in toJSON
answerSchema.set('toJSON', {
  virtuals: true
});

// This will remove `_id` and `__v`
answerSchema.plugin(mongooseHidden);

export default mongoose.model('Answer', answerSchema);
