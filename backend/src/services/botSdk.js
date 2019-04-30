import Question from '../models/Question';
import fbSdk from './fbSdk';
import logger from '../logger';

async function askQuestions({ userId, maxNum = 3 }) {
  const questions = await Question.find({}).limit(maxNum);

  const questions2 = questions.map(q => {
    return {
      title: q.text,
      payload: JSON.stringify({
        id: q.questionId,
        title: q.text
      })
    };
  });

  logger.info(`Asking questions=${JSON.stringify(questions2)}`);

  return fbSdk.sendQuestions({
    userId,
    title: 'Can you help us?',
    buttonArr: questions2
  });
}

export default {
  askQuestions
};
