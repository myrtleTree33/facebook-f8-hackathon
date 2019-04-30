import { Router } from 'express';
import Qustion from '../models/Question';

const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.json({ message: 'Welcome to starter-backend!' });
});

/**
 * INSERT QUESTION
 */

routes.post('/question', (req, res) => {

  const qustion = req.body;
  res.json(questions);

  // Qustion.insert( { qustion } )
  // let newvalue = new Qustion( { qustion } );
  // dbo.collection("customers").find({}).toArray(function(err, result) {
  //   if (err) throw err;
  //   console.log(result);
  //   db.close();
  // });
  // const tmp = Qustion.find({}).toArray((err, result)=>{
  //   if (err) throw err;
  //   console.log(result);

  // })

  // Qustion.find(function(err, questions){
  //   if(err) return res.status(500).send({error: 'database failure'});
  //   res.json(questions);
  // })

  
});



/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get('/list', (req, res, next) => {
  const { title } = req.query;

  if (title == null || title === '') {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }

  res.render('index', { title });
});

export default routes;
