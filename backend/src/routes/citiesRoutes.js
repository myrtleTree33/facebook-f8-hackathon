import { Router } from 'express';
import _ from 'lodash';
import City from '../models/City';
import Answer from '../models/Answer';
import Question from '../models/Question';

const routes = Router();

routes.get('/', (req, res) => {
  res.json({ message: 'Cities routes backend' });
});

routes.get('/cities', async (req, res, next) => {
  let query = req.query.q || '';
  query = query.trim().toLowerCase();

  // empty set
  if (query === '') {
    return res.json([]);
  }

  console.log(`City query=${query}`);

  const cities = await City.find({
    cityName: {
      $regex: _.escapeRegExp(query),
      $options: ''
    }
  }).limit(10);

  return res.json(_.reverse(cities));
});

routes.post('/info', async (req, res, next) => {
  const { city } = req.body;
  const answers = await Answer.find({ city }).lean();

  const questionPromises = answers.map(answer => {
    const { questionId } = answer;
    return Question.findOne({ questionId });
  });

  const questions = await Promise.all(questionPromises);
  const questionsMap = Object.assign({}, ...questions.map(p => ({ [p.questionId]: p.text })));
  console.log(questionsMap);

  const result = answers.map((answer, i) => {
    return {
      ...answer,
      questionText: questionsMap[answer.questionId]
    };
  });

  return res.json(result);
});

export default routes;
