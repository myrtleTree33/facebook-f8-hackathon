import { Router } from 'express';
import _ from 'lodash';
import City from '../models/City';

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
  }).limit(1000);

  return res.json(cities);
});

export default routes;
