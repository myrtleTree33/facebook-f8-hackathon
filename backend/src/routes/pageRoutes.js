import { Router } from 'express';
import logger from '../logger';
import Question from '../models/Question';
import processDialog from '../services/processDialog';
import initBot from '.././services/initChatbot';
import generic from '.././services/messageTemplates';
import answer from '.././services/quickReply';

const routes = Router();

const { PAGE_ACCESS_TOKEN, VERIFY_TOKEN, BOT_ID } = process.env;

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

  if (body.object === 'page') {
    body.entry.forEach(elem => {
      elem.messaging.forEach(event => {
        // initBot();

        console.log('********************');
        console.log('event', JSON.stringify(event, null, 2));
        console.log('********************');

        // if (event.message.text == "Quick_Replies") {
        //   answer(event);
        // } else if ( event.postback.payload === 'DEVELOPER_DEFINED_PAYLOAD' ) {
        //   console.log('********************');
        //   console.log('postback check');
        //   console.log('********************');
        //   generic(event);
        // }

        if (event.message && event.message.text) {
          // Do not process if sender is the BOT ID
          if (event.sender.id !== BOT_ID) {
            console.log('********************');
            console.log(event);
            console.log('********************');
            processDialog(event);
          }
        } else if (event.postback && event.postback.payload === 'DEVELOPER_DEFINED_PAYLOAD') {
          // TODO here ---------------------------
          // processGeneric(event);
        }
      });
    });

    return res.status(200).send('EVENT_RECEIVED');
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
