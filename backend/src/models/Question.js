import mongoose from 'mongoose';

const mongooseHidden = require('mongoose-hidden')();

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

const questionSchema = new Schema({
  questionId: {
    type: String,
    required: true,
    default: genId
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
