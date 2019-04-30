import Question from '../models/Question';
import fbSdk from './fbSdk';
import logger from '../logger';

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

  const qnPrompt =
    ```
  Can you help us with the following questions?

  ``` + prettyPrintQns({ userId, text: questions });

  fbSdk.sendMessage(qnPrompt);

  return fbSdk.sendQuestions({
    userId,
    title: 'Can you help us?',
    buttonArr: questions2
  });
}

export default {
  askQuestions
};
