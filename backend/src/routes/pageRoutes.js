import { Router } from 'express';
import logger from '../logger';
import Question from '../models/Question';
import processDialog from '../services/processDialog';

const routes = Router();

const { PAGE_ACCESS_TOKEN, VERIFY_TOKEN } = process.env;

// function callSendAPI( async (sender_psid, response) => {
//   let request_body = {
//     recipient: {
//       id: sender_psid
//     },
//     message: response
//   };

//   request(
//     {
//       uri: 'https://graph.facebook.com/v2.6/me/messages',
//       qs: { access_token: PAGE_ACCESS_TOKEN },
//       method: 'POST',
//       json: request_body
//     },
//     (err, res, body) => {
//       if (!err) {
//         console.log('message sent!');
//       } else {
//         console.error(`Unable to send message: ${err}`);
//       }
//     }
//   );
// }

// function handleMessage(senderPsid, receivedMessage) {
//   let response;
//   if (receivedMessage.text) {
//     response = {
//       text: `You sent the message: ${receivedMessage.text}. Now send me an image!`
//     };
//   }
//   callSendAPI(senderPsid, response);
// }

routes.get('/', (req, res) => {
  res.json({ message: 'Facebook pages backend' });
});

routes.get('/webhook', (req, res, next) => {
  console.log('webhook test');
  const hubChallenge = req.query['hub.challenge'];
  const verifyToken = req.query['hub.verify_token'];
  if (verifyToken === VERIFY_TOKEN) {
    logger.info(`Sent hub challenge ${hubChallenge}`);
    return res.send(hubChallenge);
  }
  res.send('wrong token');
});

routes.post('/webhook', (req, res) => {
  const { body } = req;
  console.log(`Received payload=${JSON.stringify(body)}`);

  if (req.body.object === 'page') {
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        console.log('********************');
        console.log(event);
        console.log('********************');
        if (event.message && event.message.text) {
          processDialog(event);
          // processMessage(event);
        }
      });
    });

    res.status(200).end();
  }

  // if (body.object === 'page') {
  //   // TODO: Find and do something to the event page
  //   // TODO: save user pid
  //   res.send('EVENT_RECEIVED');
  // } else {
  //   res.sendStatus(404);
  // }
});

export default routes;
