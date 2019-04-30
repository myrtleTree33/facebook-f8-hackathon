import randomInt from 'random-int';
import _ from 'lodash';

import Question from '../models/Question';
import fbSdk from './fbSdk';
import logger from '../logger';
import User from '../models/User';

function prettyPrintQns(questions) {
  const result = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    result.push(`${i}. ${q.text}`);
  }
  return result.join('\n\n');
}

async function askQuestions({ userId, maxNum = 3 }) {
  // retrieve current user
  const user = await User.findOne({ userId });
  const city = user.citiesTraveled[randomInt(0, user.citiesTraveled.length - 1)];
  const questions = _.shuffle(await Question.find({})).slice(0, 3);

  // format questions
  const questions2 = questions.map((q, i) => {
    return {
      title: `Answer qn. ${i}`,
      payload: JSON.stringify({
        id: q.questionId,
        title: q.text,
        city
      })
    };
  });

  logger.info(`Asking questions=${JSON.stringify(questions2)}`);

  const qnPrompt =
    `Can you help us answer the following questions for *${city}*?\n\n` + prettyPrintQns(questions);

  await fbSdk.sendMessage({ userId, text: qnPrompt });

  return fbSdk.sendQuestions({
    userId,
    title: `Select a question for ${city}!`,
    buttonArr: questions2
  });
}

async function processPostback(event) {
  const userId = event.sender.id;
  const payload = JSON.parse(event.postback.payload);
  const { id, title, city } = payload;

  // Save question state to user, as context
  const user = await User.findOneAndUpdate(
    { userId },
    { currQn: { id, title, city } },
    { upsert: true, new: true }
  );

  await fbSdk.sendMessage({
    userId,
    text: `Thanks for helping answer questions for **${city}**!\n\n${title}`
  });
}

export default {
  askQuestions,
  processPostback
};
