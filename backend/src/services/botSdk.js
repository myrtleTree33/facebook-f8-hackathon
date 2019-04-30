import Question from '../models/Question';
import fbSdk from './fbSdk';

async function askQuestions({ userId, maxNum = 3 }) {
  const questions = await Question.find({}).limit(maxNum);

  const questions2 = questions.map(q => {
    return {
      title: q.text,
      payload: {
        id: q.questionId,
        title: q.text
      }
    };
  });

  return fbSdk.sendQuestions({
    userId,
    title: 'Can you help us?',
    btnArr: questions2
  });
}

export default {
  askQuestions
};
