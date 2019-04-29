import { Router } from 'express';
import logger from '../logger';

const routes = Router();

const { PAGE_ACCESS_TOKEN } = process.env;
const VERIFY_TOKEN = 'VERIFY_TOKEN';

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
  console.log('-------------------------------');
  console.log(`Received payload=${JSON.stringify(body)}`);
  console.log('-------------------------------');
  res.json({ hello: 'world' });
  // if (body.object === 'page') {
  //   body.entry.forEach(entry => {
  //     let webhookEvent = entry.messaging[0];
  //     let senderPsid = webhookEvent.sender.id;
  //     logger.info(`Sender PSID: ${senderPsid}`);

  //     if (webhookEvent.message) {
  //       // handleMessage(senderPsid, webhookEvent.message);
  //     } else if (webhookEvent.postback) {
  //       // handlePostback(senderPsid, webhookEvent.postback);
  //     }
  //   });
  //   res.send('EVENT_RECEIVED');
  // } else {
  //   res.sendStatus(404);
  // }
});

export default routes;
