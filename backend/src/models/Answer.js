import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import logger from '../logger';

let mongooseHidden = require('mongoose-hidden')();

const { Schema } = mongoose;

function genId() {
  const LENGTH = 15;
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const answerSchema = new Schema({
  answerId: {
    type: String,
    required: true,
    default: genId
  },
  questionId: {
    type: String,
    required: true
  },
  city: {
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
    default: Date.now
  }
});

// This will add `id` in toJSON
answerSchema.set('toJSON', {
  virtuals: true
});

// This will remove `_id` and `__v`
answerSchema.plugin(mongooseHidden);

export default mongoose.model('Answer', answerSchema);
