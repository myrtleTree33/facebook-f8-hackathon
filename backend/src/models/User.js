import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import logger from '../logger';

let mongooseHidden = require('mongoose-hidden')();

const { Schema } = mongoose;

const userSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  cities: {
    type: [String],
    default: []
  },
  type: {
    type: String,
    default: 'NORMAL'
  },
  citiesInterested: {
    type: [String],
    default: []
  },
  citiesTraveled: {
    type: [String],
    default: []
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    select: false
  },
  currQn: {
    type: Object
  }
});

// This will add `id` in toJSON
userSchema.set('toJSON', {
  virtuals: true
});

// This will remove `_id` and `__v`
userSchema.plugin(mongooseHidden);

export default mongoose.model('User', userSchema);
