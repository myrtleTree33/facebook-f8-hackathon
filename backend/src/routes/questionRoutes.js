import { Router } from 'express';
import Qustion from '../models/Question';

const routes = Router();

routes.post('/question', (req, res) => {

    const qustion = req.body;
    Qustion.insert( { qustion } )

    // res.json(Qustion.find());
    res.json({ message: 'question' });

})
.get('/question', (req, res) => {


    res.json({ message: 'question' });

});

export default routes;
