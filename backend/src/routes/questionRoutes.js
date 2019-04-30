import { Router } from 'express';
import Qustion from '../models/Question';

const routes = Router();

routes.post('/qustion', (req, res) => {

    const qustion = req.body;
    Qustion.insert( { qustion } )

    res.json(Qustion.find());
});

export default routes;
