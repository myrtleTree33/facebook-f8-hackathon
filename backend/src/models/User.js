import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import logger from '../logger';

let mongooseHidden = require('mongoose-hidden')();

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  cities: {
    type: [String],
    required: true
  },
  countries: {
    type: [String],
    required: true
  },
  type: {
    type: String,
    required: true
  },
  citiesInterested: {
    type: [String],
    required: true
  },
  countriesInterested: {
    type: [String],
    required: true
  },
  citiesTraveled: {
    type: [String],
    required: true
  },
  countriesTraveled: {
    type: [String],
    required: true
  },
  cityBorn: {
    type: [String],
    required: true
  },
  countryBorn: {
    type: [String],
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
userSchema.set('toJSON', {
  virtuals: true
});

// This will remove `_id` and `__v`
userSchema.plugin(mongooseHidden);

export default mongoose.model('User', userSchema);
