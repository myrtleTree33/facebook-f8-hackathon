import { Router } from 'express';
import Question from '../models/Question';

const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.json({ message: 'This is the questions page' });
});

/**
 * INSERT QUESTION
 */

routes.post('/', async (req, res) => {
  const { text } = req.body;
  const question = new Question({
    text
  });

  const savedQn = await question.save();
  res.json(savedQn);
});

routes.get('/:id', async (req, res) => {
  const { id: questionId } = req.params;
  const question = await Question.findOne({ questionId });
  res.json(question);
});

export default routes;
