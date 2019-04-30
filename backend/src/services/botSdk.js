import Question from '../models/Question';
import fbSdk from './fbSdk';
import logger from '../logger';
import { brotliDecompressSync } from 'zlib';

function prettyPrintQns(questions) {
  const result = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    result.push(`${i}. ${q.text}`);
  }
  return result.join('\n\n');
}

async function askQuestions({ userId, maxNum = 3 }) {
  const questions = await Question.find({}).limit(maxNum);

  const questions2 = questions.map((q, i) => {
    return {
      title: `Answer qn. ${i}`,
      payload: JSON.stringify({
        id: q.questionId,
        title: q.text
      })
    };
  });

  logger.info(`Asking questions=${JSON.stringify(questions2)}`);

  const qnPrompt =
    'Can you help us answer the following questions?\n\n' + prettyPrintQns(questions);

  await fbSdk.sendMessage({ userId, text: qnPrompt });

  return fbSdk.sendQuestions({
    userId,
    title: 'Select a question!',
    buttonArr: questions2
  });
}

async function processPostback(event) {
  const userId = event.sender.id;
  const payload = JSON.parse(event.postback.payload);
  const { id, title } = payload;

  await fbSdk.sendMessage({
    userId,
    text: `Thanks for helping!  ${title}`
  });

  // TODO save to userDb
}

export default {
  askQuestions,
  processPostback
};
