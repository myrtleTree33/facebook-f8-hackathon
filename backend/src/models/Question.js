import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import logger from '../logger';

let mongooseHidden = require('mongoose-hidden')();

const { Schema } = mongoose;

const questionSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  categories: {
    type: [String]
  },
  teCreated: {
    type: Date,
    required: true,
    default: Date.now,
    select: false
  }
});

const answerSchema = new Schema({
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
questionSchema.set('toJSON', {
  virtuals: true
});

// This will remove `_id` and `__v`
questionSchema.plugin(mongooseHidden);

export default mongoose.model('Question', questionSchema);
